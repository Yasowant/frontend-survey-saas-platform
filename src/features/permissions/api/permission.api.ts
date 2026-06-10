import { api } from "@/shared/api/axios";

export const createPermission = async (payload: { name: string; description: string }) => {
  const response = await api.post("/permissions", payload);
  return response.data;
};

export const getPermissions = async () => {
  const response = await api.get("/permissions");
  return response.data;
};
