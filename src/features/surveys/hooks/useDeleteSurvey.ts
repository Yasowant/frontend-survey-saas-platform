import { useMutation, useQueryClient } from "@tanstack/react-query";
import { surveyService } from "../services/survey.service";
import { toast } from "sonner";

export const useDeleteSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyService.deleteSurvey(id),

    onSuccess: (data) => {
      toast.success(data.message || "Survey deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["surveys"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete survey");
    },
  });
};
