import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roleService } from "../services/role.service";

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        name: string;
        permissions: string[];
      };
    }) => roleService.updateRoleById(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });

      queryClient.invalidateQueries({
        queryKey: ["role", variables.id],
      });
    },
  });
};
