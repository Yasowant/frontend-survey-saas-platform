import { useQuery } from "@tanstack/react-query";
import { getResponsesBySurveyId } from "../api/response.api";

export const useSurveyResponses = (surveyId: string, enabled = true) => {
  return useQuery({
    queryKey: ["survey-responses", surveyId],
    queryFn: () => getResponsesBySurveyId(surveyId),
    enabled: enabled && !!surveyId,
  });
};
