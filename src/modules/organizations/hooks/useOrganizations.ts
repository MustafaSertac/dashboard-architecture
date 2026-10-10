import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { isApiError } from "@/lib/api/error";
import { organizationService } from "@/modules/organizations/services/organization.service";
import {
  isValidRegistrationCode,
  normalizeRegistrationCode,
  type CreateOrganizationRequest,
  type GenerateCodeRequest,
  type JoinOrganizationRequest,
  type MyOrganizationResponse,
  type RegistrationCodeDTO,
  type UpdateVisibilityRequest,
} from "@/modules/organizations/types/organization.types";

export function useMyOrganization() {
  return useQuery({
    queryKey: qk.organizations.me,
    queryFn: async (): Promise<MyOrganizationResponse | null> => {
      try {
        return await organizationService.getMyOrganization();
      } catch (error) {
        // Uye degilse backend 404 ERR_ORGANIZATION_NOT_FOUND doner -> null kabul et.
        if (isApiError(error) && error.code === "ERR_ORGANIZATION_NOT_FOUND") {
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });
}

export function useOrganizationTeachers(organizationId: string | undefined) {
  return useQuery({
    queryKey: qk.organizations.teachers(organizationId ?? ""),
    queryFn: () =>
      organizationService.getOrganizationTeachers(organizationId ?? ""),
    enabled: !!organizationId,
  });
}

export function useValidateCode(code: string) {
  const normalized = normalizeRegistrationCode(code);
  return useQuery({
    queryKey: qk.organizations.validateCode(normalized),
    queryFn: () => organizationService.validateCode(normalized),
    enabled: isValidRegistrationCode(normalized),
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrganizationRequest) =>
      organizationService.createOrganization(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.organizations.me }),
  });
}

export function useJoinOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: JoinOrganizationRequest) =>
      organizationService.joinOrganization(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.organizations.me }),
  });
}

export function useUpdateVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateVisibilityRequest) =>
      organizationService.updateVisibility(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.organizations.me }),
  });
}

export function useGenerateStudentCode(organizationId: string | undefined) {
  return useMutation({
    mutationFn: (data: GenerateCodeRequest = {}): Promise<RegistrationCodeDTO> =>
      organizationService.generateStudentCode(organizationId ?? "", data),
  });
}

export function useGenerateTeacherCode(organizationId: string | undefined) {
  return useMutation({
    mutationFn: (data: GenerateCodeRequest = {}): Promise<RegistrationCodeDTO> =>
      organizationService.generateTeacherCode(organizationId ?? "", data),
  });
}

export function useGenerateMyStudentCode() {
  return useMutation({
    mutationFn: (data: GenerateCodeRequest = {}): Promise<RegistrationCodeDTO> =>
      organizationService.generateMyStudentCode(data),
  });
}
