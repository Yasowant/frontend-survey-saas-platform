import { api } from "@/shared/api/axios";

export const createSurvey = async (payload: {
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
  settings: {
    allowAnonymousResponses: boolean;
    allowMultipleResponses: boolean;
  };
}) => {
  const response = await api.post("/surveys", payload);

  return response.data;
};

export const getSurveys = async () => {
  const response = await api.get("surveys");
  return response.data;
};

export const getSurveyById = async (id: string) => {
  const response = await api.get(`/surveys/${id}/details`);
  return response.data;
};

export const submitSurveyResponse = async (payload: {
  surveyId: string;
  answers: {
    questionId: string;
    value: string | number | boolean;
  }[];
}) => {
  const response = await api.post("/responses", payload);
  return response.data;
};
