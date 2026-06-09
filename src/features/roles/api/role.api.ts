import { api } from "@/shared/api/axios";

export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

export const getRoleById = async (id: string) => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};
