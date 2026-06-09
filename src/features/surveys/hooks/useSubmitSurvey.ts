import { useMutation } from "@tanstack/react-query";

import { surveyService } from "../services/survey.service";

export const useSubmitSurvey = () => {
  return useMutation({
    mutationFn: surveyService.submitSurveyResponse,
  });
};
