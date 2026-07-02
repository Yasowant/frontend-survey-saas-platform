import { useMutation } from "@tanstack/react-query";

import { surveyService } from "../services/survey.service";

export const useSubmitPublicSurvey = () => {
  return useMutation({
    mutationFn: surveyService.submitPublicSurveyResponse,
  });
};
