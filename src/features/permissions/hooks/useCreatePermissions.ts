import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { permissionService } from "../services/permission.service";

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permissionService.createPermisson,
    onSuccess: (data) => {
      toast.success(data?.message || "Permission created successfully");
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create permission");
    },
  });
};
