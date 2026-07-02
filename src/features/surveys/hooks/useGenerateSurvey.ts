import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { surveyService } from "../services/survey.service";

export const useGenerateSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (prompt: string) => surveyService.generateSurvey(prompt),

    onSuccess: (data) => {
      toast.success(data.message || "Survey generated as a draft");
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "AI generation failed");
    },
  });
};
