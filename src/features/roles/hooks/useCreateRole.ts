import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roleService } from "../services/role.service";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: roleService.createRoles,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
  });
};
