import { api } from "@/shared/api/axios";

export const getResponses = async () => {
  const response = await api.get("/responses");

  return response.data;
};

export const getResponsesBySurveyId = async (surveyId: string) => {
  const response = await api.get(`/responses/survey/${surveyId}`);

  return response.data;
};
