export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: 0 | 1 | 2;
  avatar?: string;
  isVerified: boolean;
  isKvkVerified: boolean;
  phoneNumber: string;
  gender: 0 | 1;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfileResponse;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface StudentRegisterRequest {
  name: string;
  email: string;
  password: string;
  gender?: 0 | 1;
  phoneNumber?: string;
}

export interface TeacherRegisterRequest {
  name: string;
  email: string;
  password: string;
  gender?: 0 | 1;
  phoneNumber?: string;
}

export interface ForgotPasswordRequest {
  email: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phoneNumber?: string;
  gender?: 0 | 1;
  avatar?: string;
}
