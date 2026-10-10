import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  CreateOrganizationRequest,
  GenerateCodeRequest,
  JoinOrganizationRequest,
  MyOrganizationResponse,
  OrganizationDTO,
  OrganizationTeacherDTO,
  RegistrationCodeDTO,
  UpdateVisibilityRequest,
  ValidateCodeResponse,
} from "@/modules/organizations/types/organization.types";

export const organizationService = {
  async createOrganization(
    data: CreateOrganizationRequest
  ): Promise<OrganizationDTO> {
    const res = await apiClient.post(endpoints.organizations.create, data);
    return res.data.data;
  },

  async joinOrganization(data: JoinOrganizationRequest): Promise<OrganizationDTO> {
    const res = await apiClient.post(endpoints.organizations.join, data);
    return res.data.data;
  },

  async getMyOrganization(): Promise<MyOrganizationResponse> {
    const res = await apiClient.get(endpoints.organizations.me);
    return res.data.data;
  },

  async updateVisibility(
    data: UpdateVisibilityRequest
  ): Promise<MyOrganizationResponse> {
    const res = await apiClient.patch(endpoints.organizations.visibility, data);
    return res.data.data;
  },

  async getOrganizationTeachers(
    organizationId: string
  ): Promise<OrganizationTeacherDTO[]> {
    const res = await apiClient.get(
      endpoints.organizations.teachers(organizationId)
    );
    return res.data.data;
  },

  async generateStudentCode(
    organizationId: string,
    data: GenerateCodeRequest = {}
  ): Promise<RegistrationCodeDTO> {
    const res = await apiClient.post(
      endpoints.organizations.codes(organizationId),
      data
    );
    return res.data.data;
  },

  async generateTeacherCode(
    organizationId: string,
    data: GenerateCodeRequest = {}
  ): Promise<RegistrationCodeDTO> {
    const res = await apiClient.post(
      endpoints.organizations.teacherCodes(organizationId),
      data
    );
    return res.data.data;
  },

  async generateMyStudentCode(
    data: GenerateCodeRequest = {}
  ): Promise<RegistrationCodeDTO> {
    const res = await apiClient.post(endpoints.teachers.myCodes, data);
    return res.data.data;
  },

  async validateCode(code: string): Promise<ValidateCodeResponse> {
    const res = await apiClient.post(endpoints.organizations.validateCode, {
      code,
    });
    return res.data.data;
  },
};
