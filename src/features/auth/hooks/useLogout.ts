import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useLogout = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => authService.logout(refreshToken),
  });
};
