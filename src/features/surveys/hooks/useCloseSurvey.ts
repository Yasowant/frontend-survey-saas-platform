import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { surveyService } from "../services/survey.service";

export const useCloseSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyService.closeSurvey(id),

    onSuccess: (data) => {
      toast.success(data.message || "Survey closed successfully");
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to close survey");
    },
  });
};
