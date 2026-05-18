import { useMutation } from "@tanstack/react-query";
import { loginApi, registerApi } from "../services/auth.api";
import { useAuthStore } from "../store/useAuthStore";

export const useLogin = () => {
  const login = useAuthStore((s) => s.login);
  return useMutation(({ email, password }: { email: string; password: string }) => loginApi(email, password), {
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
};

export const useRegister = () => {
  const login = useAuthStore((s) => s.login);
  return useMutation(({ name, email, password }: { name: string; email: string; password: string }) =>
    registerApi(name, email, password),
  {
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
};
