import { api } from "@/shared/api/axios";

export const getPermissions = async () => {
  const response = await api.get("/permissions");

  return response.data;
};
