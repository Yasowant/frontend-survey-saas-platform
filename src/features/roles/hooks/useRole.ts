import { useQuery } from "@tanstack/react-query";
import { roleService } from "../services/role.service";

export const useRole = (id: string) => {
  return useQuery({
    queryKey: ["role", id],

    queryFn: () => roleService.getRoleById(id),

    enabled: !!id,
  });
};
