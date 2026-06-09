import { api } from "@/shared/api/axios";

export const createSection = async (payload: {
  surveyId: string;
  title: string;
  description?: string;
  order: number;
}) => {
  const response = await api.post("/sections", payload);
  console.log(response);
  return response.data;
};
