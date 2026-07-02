import { api } from "@/shared/api/axios";

export interface ApiSettings {
  workspaceName: string;
  defaultLanguage: string;
  allowAnonymous: boolean;
  requireEmail: boolean;
  emailNotifs: boolean;
  pushNotifs: boolean;
  twoFactor: boolean;
}

export const getSettings = async () => {
  const response = await api.get("/settings");
  return response.data;
};

export const updateSettings = async (payload: Partial<ApiSettings>) => {
  const response = await api.put("/settings", payload);
  return response.data;
};
