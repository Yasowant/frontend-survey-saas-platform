import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSection } from "../services/section.service";

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSection(id),

    onSuccess: (data) => {
      toast.success(data?.message || "Section deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["survey"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete section");
    },
  });
};
