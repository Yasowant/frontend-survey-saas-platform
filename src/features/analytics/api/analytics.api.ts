import { api } from "@/shared/api/axios";

export const getDashboardAnalytics = async () => {
  const response = await api.get("/analytics/dashboard");

  return response.data;
};

export const getSurveyAnalytics = async (surveyId: string) => {
  const response = await api.get(`/analytics/survey/${surveyId}`);

  return response.data;
};
