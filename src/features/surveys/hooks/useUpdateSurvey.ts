import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { surveyService } from "../services/survey.service";

export const useUpdateSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        title?: string;
        description?: string;
        status?: "DRAFT" | "PUBLISHED" | "CLOSED";
      };
    }) => surveyService.updateSurvey(id, payload),

    onSuccess: (data) => {
      toast.success(data.message || "Survey updated successfully");
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update survey");
    },
  });
};
