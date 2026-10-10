import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiClient } from "@/lib/api/client";
import { organizationService } from "@/modules/organizations/services/organization.service";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const codeDto = {
  id: "c1",
  code: "7CKRMNEC",
  type: 0,
  organizationId: null,
  teacherId: "t1",
  expiresAt: "2026-10-04T14:39:05+00:00",
  createdAt: "2026-09-27T14:39:05+00:00",
  isUsed: false,
  usedAt: null,
};

describe("organizationService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createOrganization POST /organizations gonderir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { data: { id: "o1", name: "Akademi", createdAt: "x" } },
    });

    await organizationService.createOrganization({ name: "Akademi" });

    expect(apiClient.post).toHaveBeenCalledWith("/organizations", {
      name: "Akademi",
    });
  });

  it("joinOrganization POST /organizations/join gonderir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { data: { id: "o1", name: "Akademi", createdAt: "x" } },
    });

    await organizationService.joinOrganization({ code: "ABCDEFGH" });

    expect(apiClient.post).toHaveBeenCalledWith("/organizations/join", {
      code: "ABCDEFGH",
    });
  });

  it("getMyOrganization GET /organizations/me cagirir", async () => {
    const me = {
      organization: { id: "o1", name: "Akademi", createdAt: "x" },
      canViewAllStudents: true,
    };
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: me } });

    const res = await organizationService.getMyOrganization();

    expect(apiClient.get).toHaveBeenCalledWith("/organizations/me");
    expect(res.canViewAllStudents).toBe(true);
  });

  it("updateVisibility PATCH /organizations/me/visibility gonderir", async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({
      data: {
        data: {
          organization: { id: "o1", name: "A", createdAt: "x" },
          canViewAllStudents: false,
        },
      },
    });

    await organizationService.updateVisibility({ canViewAllStudents: false });

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/organizations/me/visibility",
      { canViewAllStudents: false }
    );
  });

  it("getOrganizationTeachers GET /organizations/{id}/teachers cagirir", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: [] } });

    await organizationService.getOrganizationTeachers("o1");

    expect(apiClient.get).toHaveBeenCalledWith("/organizations/o1/teachers");
  });

  it("generateStudentCode POST /organizations/{id}/codes gonderir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: codeDto } });

    await organizationService.generateStudentCode("o1", { expiresInDays: 7 });

    expect(apiClient.post).toHaveBeenCalledWith("/organizations/o1/codes", {
      expiresInDays: 7,
    });
  });

  it("generateTeacherCode POST /organizations/{id}/teacher-codes gonderir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: codeDto } });

    await organizationService.generateTeacherCode("o1");

    expect(apiClient.post).toHaveBeenCalledWith(
      "/organizations/o1/teacher-codes",
      {}
    );
  });

  it("generateMyStudentCode POST /teachers/me/codes gonderir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { data: codeDto } });

    const res = await organizationService.generateMyStudentCode({
      expiresInDays: 7,
    });

    expect(apiClient.post).toHaveBeenCalledWith("/teachers/me/codes", {
      expiresInDays: 7,
    });
    expect(res.code).toBe("7CKRMNEC");
  });

  it("validateCode POST /organizations/codes/validate gonderir", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { data: { valid: false, type: null } },
    });

    const res = await organizationService.validateCode("ABCDEFGH");

    expect(apiClient.post).toHaveBeenCalledWith(
      "/organizations/codes/validate",
      { code: "ABCDEFGH" }
    );
    expect(res.valid).toBe(false);
  });
});
