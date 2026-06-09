import { api } from "@/shared/api/axios";
export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};
