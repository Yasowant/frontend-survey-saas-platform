import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: authService.getProfile,
    staleTime: 1000 * 60 * 5,
  });
};
