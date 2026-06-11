import { api } from "@/shared/api/axios";

export const createPermission = async (payload: { name: string; description: string }) => {
  const response = await api.post("/permissions", payload);
  return response.data;
};

export const getPermissions = async () => {
  const response = await api.get("/permissions");
  console.log(response, "Data For Response");
  return response.data;
};
