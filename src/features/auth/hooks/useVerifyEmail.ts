import { useMutation } from "@tanstack/react-query";

import { authService } from "../services/auth.service";

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authService.verifyEmail,
  });
};
