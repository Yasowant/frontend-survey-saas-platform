import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { surveyService } from "../services/survey.service";

export const useShareSurvey = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { emails: string[]; message?: string };
    }) => surveyService.shareSurvey(id, payload),

    onSuccess: (data) => {
      toast.success(data.message || "Invitations are being sent");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send invitations");
    },
  });
};
