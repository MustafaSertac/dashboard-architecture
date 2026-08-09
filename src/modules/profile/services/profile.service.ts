import { authService } from "@/modules/auth/services/auth.service";

export const profileService = {
  getProfile: authService.getProfile,
  updateProfile: authService.updateProfile,
};
