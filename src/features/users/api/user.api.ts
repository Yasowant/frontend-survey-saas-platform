import { api } from "@/shared/api/axios";

export const getUsers = async () => {
  const response = await api.get("/users");

  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);

  return response.data;
};
