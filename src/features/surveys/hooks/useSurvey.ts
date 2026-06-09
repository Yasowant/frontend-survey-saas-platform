import { useQuery } from "@tanstack/react-query";

import { surveyService } from "../services/survey.service";

export const useSurvey = (id: string) => {
  return useQuery({
    queryKey: ["survey", id],
    queryFn: () => surveyService.getSurveyById(id),
    enabled: !!id,
  });
};
