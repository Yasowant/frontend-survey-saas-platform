import { api } from "@/shared/api/axios";

export const createQuestion = async (payload: {
  surveyId: string;
  sectionId: string;
  title: string;
  description?: string;
  type: string;
  required: boolean;
  options: string[];
  placeholder?: string;
  order: number;
}) => {
  const response = await api.post("/questions", payload);
  return response.data;
};
