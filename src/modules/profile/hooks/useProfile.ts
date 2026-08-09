import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query/keys";
import { profileService } from "@/modules/profile/services/profile.service";
import type { UpdateProfileRequest } from "@/modules/auth/types/auth.types";

export function useProfile(userId: string) {
  return useQuery({
    queryKey: qk.auth.profile(userId),
    queryFn: () => profileService.getProfile(userId),
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateProfileRequest;
    }) => {
      return profileService.updateProfile(data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: qk.auth.profile(variables.userId),
      });
    },
  });
}
