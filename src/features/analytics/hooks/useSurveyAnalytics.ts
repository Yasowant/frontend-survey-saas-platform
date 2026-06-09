import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics.service";

export const useSurveyAnalytics = (surveyId: string) => {
  return useQuery({
    queryKey: ["survey-analytics", surveyId],
    queryFn: () => analyticsService.getSurveyAnalytics(surveyId),
    enabled: !!surveyId,
  });
};
