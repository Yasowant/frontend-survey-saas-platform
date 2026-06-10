import { api } from "@/shared/api/axios";

export const createSection = async (payload: {
  surveyId: string;
  title: string;
  description?: string;
  order: number;
}) => {
  const response = await api.post("/sections", payload);
  return response.data;
};

export const deleteSection = async (id: string) => {
  const response = await api.delete(`/sections/${id}`);
  return response.data;
};
