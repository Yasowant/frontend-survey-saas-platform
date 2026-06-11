import { api } from "@/shared/api/axios";

export const createRoles = async (payload: { name: string; permissions: string[] }) => {
  const response = await api.post("/roles", payload);
  return response.data;
};

export const getRoles = async () => {
  const response = await api.get("/roles");
  return response.data;
};

export const getRoleById = async (id: string) => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

export const deleteRoleById = async (id: string) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};

export const updateRoleById = async (
  id: string,
  payload: {
    name: string;
    permissions: string[];
  },
) => {
  const response = await api.put(`/roles/${id}`, payload);
  return response.data;
};
