import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import axios from "axios";
import { ApiError, isApiError } from "@/lib/api/error";
import { isApiResponse, unwrapEnvelope } from "@/lib/api/envelope";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { ApiResponse } from "@/types/common";

describe("ApiError", () => {
  it("code, message, status ve details tutar", () => {
    const err = new ApiError("ERR_X", "bir hata", 400, ["detay1"]);
    expect(err.code).toBe("ERR_X");
    expect(err.message).toBe("bir hata");
    expect(err.status).toBe(400);
    expect(err.details).toEqual(["detay1"]);
    expect(err.name).toBe("ApiError");
  });

  it("details olmadan olusturulabilir", () => {
    const err = new ApiError("ERR_Y", "hata", 500);
    expect(err.details).toBeUndefined();
  });

  it("isApiError dogru tanir", () => {
    const err = new ApiError("ERR_Z", "hata", 404);
    expect(isApiError(err)).toBe(true);
    expect(isApiError(new Error("normal"))).toBe(false);
    expect(isApiError(null)).toBe(false);
  });
});

describe("isApiResponse", () => {
  it("isSuccess alanı olan objeleri tanir", () => {
    expect(isApiResponse({ isSuccess: true, data: {} })).toBe(true);
    expect(isApiResponse({ isSuccess: false, error: { code: "X", message: "Y" } })).toBe(true);
  });

  it("isSuccess alanı olmayan objeleri reddeder", () => {
    expect(isApiResponse({ data: {} })).toBe(false);
    expect(isApiResponse(null)).toBe(false);
    expect(isApiResponse("string")).toBe(false);
    expect(isApiResponse(42)).toBe(false);
  });
});

describe("unwrapEnvelope", () => {
  it("basarili response'tan data'yi cikarir", () => {
    const resp: ApiResponse<{ id: string }> = { isSuccess: true, data: { id: "1" } };
    expect(unwrapEnvelope(resp)).toEqual({ id: "1" });
  });

  it("basarisiz response'ta hata firlatir", () => {
    const resp: ApiResponse<unknown> = {
      isSuccess: false,
      error: { code: "ERR_X", message: "bir hata" },
    };
    expect(() => unwrapEnvelope(resp)).toThrow("bir hata");
  });
});

function make401(config: unknown) {
  return new axios.AxiosError(
    "Request failed with status code 401",
    axios.AxiosError.ERR_BAD_REQUEST,
    config as never,
    {},
    {
      status: 401,
      statusText: "Unauthorized",
      headers: {},
      config: config as never,
      data: {
        isSuccess: false,
        error: {
          code: "ERR_INVALID_CREDENTIALS",
          message: "Hatali email/sifre",
        },
      },
    } as never
  );
}

describe("apiClient 401 davranisi", () => {
  let originalAdapter: typeof apiClient.defaults.adapter;

  beforeEach(() => {
    originalAdapter = apiClient.defaults.adapter;
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
  });

  afterEach(() => {
    apiClient.defaults.adapter = originalAdapter;
    vi.restoreAllMocks();
  });

  it("refresh token yokken 401 gercek ApiError olarak firlatilir; refresh denenmez", async () => {
    const refreshSpy = vi.spyOn(axios, "post");
    apiClient.defaults.adapter = async (config) => {
      throw make401(config);
    };

    const err = await apiClient.post("/auth/login", {}).catch((e) => e);

    expect(err).toBeInstanceOf(ApiError);
    expect(err.code).toBe("ERR_INVALID_CREDENTIALS");
    expect(err.message).toBe("Hatali email/sifre");
    // Anonymous istekte refresh endpoint'ine gidilmemeli.
    expect(refreshSpy).not.toHaveBeenCalled();
  });
});
