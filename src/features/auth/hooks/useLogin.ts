import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,

    onSuccess: (response) => {
      localStorage.setItem("accessToken", response.data.accessToken);

      localStorage.setItem("refreshToken", response.data.refreshToken);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      localStorage.setItem("roles", JSON.stringify(response.data.roles));

      localStorage.setItem("permissions", JSON.stringify(response.data.permissions));
    },
  });
};
