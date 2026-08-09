import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  AuthResponse,
  UserProfileResponse,
  LoginRequest,
  StudentRegisterRequest,
  TeacherRegisterRequest,
  ForgotPasswordRequest,
  RefreshTokenRequest,
  LogoutRequest,
  UpdateProfileRequest,
} from "@/modules/auth/types/auth.types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post(endpoints.auth.login, data);
    return res.data.data;
  },

  async registerStudent(data: StudentRegisterRequest): Promise<AuthResponse> {
    const res = await apiClient.post(endpoints.auth.registerStudent, data);
    return res.data.data;
  },

  async registerTeacher(data: TeacherRegisterRequest): Promise<AuthResponse> {
    const res = await apiClient.post(endpoints.auth.registerTeacher, data);
    return res.data.data;
  },

  async refreshToken(data: RefreshTokenRequest): Promise<AuthResponse> {
    const res = await apiClient.post(endpoints.auth.refreshToken, data);
    return res.data.data;
  },

  async logout(data: LogoutRequest): Promise<void> {
    await apiClient.post(endpoints.auth.logout, data);
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const res = await apiClient.post(endpoints.auth.forgotPassword, data);
    return res.data.data;
  },

  async getProfile(userId: string): Promise<UserProfileResponse> {
    const res = await apiClient.get(endpoints.auth.profile(userId));
    return res.data.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponse> {
    const res = await apiClient.put(endpoints.auth.updateProfile, data);
    return res.data.data;
  },
};
