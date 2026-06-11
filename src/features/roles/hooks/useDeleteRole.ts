import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "../services/role.service";

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roleService.deleteRoleById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
};
