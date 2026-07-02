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

/** AI survey generation — describe the survey, GPT builds it as a draft. */
export const generateSurvey = async (prompt: string) => {
  const response = await api.post("/surveys/generate", { prompt });
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

export const updateSurvey = async (
  id: string,
  payload: {
    title?: string;
    description?: string;
    status?: "DRAFT" | "PUBLISHED" | "CLOSED";
  },
) => {
  const response = await api.put(`/surveys/${id}`, payload);
  return response.data;
};

export const deleteSurvey = async (id: string) => {
  const response = await api.delete(`/surveys/${id}`);
  return response.data;
};

export const publishSurvey = async (id: string) => {
  const response = await api.post(`/surveys/${id}/publish`);
  return response.data;
};

export const closeSurvey = async (id: string) => {
  const response = await api.post(`/surveys/${id}/close`);
  return response.data;
};

/** Share a published survey by email — invitations are sent in the background. */
export const shareSurvey = async (id: string, payload: { emails: string[]; message?: string }) => {
  const response = await api.post(`/surveys/${id}/share`, payload);
  return response.data;
};

/** Public (no auth) — used by respondents opening a shared link. */
export const getPublicSurvey = async (id: string) => {
  const response = await api.get(`/surveys/${id}/public`);
  return response.data;
};

export const submitSurveyResponse = async (payload: {
  surveyId: string;
  answers: {
    questionId: string;
    value: string | number | boolean | string[];
  }[];
}) => {
  const response = await api.post("/responses", payload);
  return response.data;
};

/** Public (no auth) — anonymous response submission. */
export const submitPublicSurveyResponse = async (payload: {
  surveyId: string;
  answers: {
    questionId: string;
    value: string | number | boolean | string[];
  }[];
}) => {
  const response = await api.post("/responses/public", payload);
  return response.data;
};
