import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api/client";
import { authService } from "@/modules/auth/services/auth.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("authService (temel akis)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login /auth/login endpoint'ini cagirir", async () => {
    const authResp = { accessToken: "at", refreshToken: "rt", user: { id: "u1", name: "Elif", email: "e@x.com", role: 2, isVerified: true, isKvkVerified: true, phoneNumber: "1", gender: 1 } };
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: authResp } });

    const res = await authService.login({ email: "e@x.com", password: "pw" });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", { email: "e@x.com", password: "pw" });
    expect(res.accessToken).toBe("at");
  });

  it("registerStudent /auth/student endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { accessToken: "at", refreshToken: "rt", user: { id: "u2", name: "S", email: "s@x.com", role: 2, isVerified: true, isKvkVerified: true, phoneNumber: "1", gender: 0 } } } });

    await authService.registerStudent({ name: "S", email: "s@x.com", password: "pw" });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/student", { name: "S", email: "s@x.com", password: "pw" });
  });

  it("registerTeacher /auth/teacher endpoint'ini cagirir (onemli rota)", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { accessToken: "at", refreshToken: "rt", user: { id: "t1", name: "T", email: "t@x.com", role: 1, isVerified: true, isKvkVerified: true, phoneNumber: "1", gender: 0 } } } });

    await authService.registerTeacher({ name: "T", email: "t@x.com", password: "pw" });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/teacher", { name: "T", email: "t@x.com", password: "pw" });
  });

  it("refreshToken /auth/refresh-token endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { accessToken: "new-at", refreshToken: "new-rt", user: { id: "u1", name: "U", email: "u@x.com", role: 2, isVerified: true, isKvkVerified: true, phoneNumber: "1", gender: 0 } } } });

    const res = await authService.refreshToken({ refreshToken: "old-rt" });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/refresh-token", { refreshToken: "old-rt" });
    expect(res.accessToken).toBe("new-at");
  });

  it("logout /auth/logout endpoint'ini cagirir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { message: "ok" } } });

    await authService.logout({ refreshToken: "rt" });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/logout", { refreshToken: "rt" });
  });

  it("getProfile /auth/profiles/{userId} endpoint'ini cagirir", async () => {
    const profile = { id: "u1", name: "U", email: "u@x.com", role: 2, isVerified: true, isKvkVerified: true, phoneNumber: "1", gender: 0 };
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: profile } });

    const res = await authService.getProfile("u1");

    expect(apiClient.get).toHaveBeenCalledWith("/auth/profiles/u1");
    expect(res.id).toBe("u1");
  });

  it("updateProfile PUT /auth/profiles endpoint'ini cagirir", async () => {
    const profile = { id: "u1", name: "U2", email: "u@x.com", role: 2, isVerified: true, isKvkVerified: true, phoneNumber: "1", gender: 0 };
    vi.mocked(apiClient.put).mockResolvedValue({ data: { data: profile } });

    await authService.updateProfile({ name: "U2" });

    expect(apiClient.put).toHaveBeenCalledWith("/auth/profiles", { name: "U2" });
  });
});

describe("authService (forgot-password 3-adim)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("forgotPasswordRequest email gonderir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { message: "ok" } } });

    await authService.forgotPasswordRequest({ email: "a@b.com" });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/auth/forgot-password/request",
      { email: "a@b.com" }
    );
  });

  it("forgotPasswordVerify token dogrular", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { valid: true } } });

    const res = await authService.forgotPasswordVerify({ token: "tok" });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/auth/forgot-password/verify",
      { token: "tok" }
    );
    expect(res.valid).toBe(true);
  });

  it("forgotPasswordReset token + yeni sifre gonderir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: { message: "ok" } } });

    await authService.forgotPasswordReset({ token: "tok", newPassword: "yeni123" });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/auth/forgot-password/reset",
      { token: "tok", newPassword: "yeni123" }
    );
  });
});
