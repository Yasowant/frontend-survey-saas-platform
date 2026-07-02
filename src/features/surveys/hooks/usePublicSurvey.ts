import { useQuery } from "@tanstack/react-query";

import { surveyService } from "../services/survey.service";

export const usePublicSurvey = (id: string) => {
  return useQuery({
    queryKey: ["public-survey", id],
    queryFn: () => surveyService.getPublicSurvey(id),
    enabled: !!id,
    retry: false,
  });
};
