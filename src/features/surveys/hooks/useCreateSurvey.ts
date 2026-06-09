import { useMutation } from "@tanstack/react-query";

import { surveyService } from "../services/survey.service";

export const useCreateSurvey = () => {
  return useMutation({
    mutationFn: surveyService.createSurvey,
  });
};
