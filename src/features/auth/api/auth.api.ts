import { api } from "@/shared/api/axios";

import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth.types";

export const registerUser = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post("/auth/register", payload);

  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await api.get(`/auth/verify-email?token=${token}`);

  return response.data;
};

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", payload);

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/users/me");
  console.log(response, "Response");
  return response;
};

export const logout = async (refreshToken: string) => {
  const response = await api.post("/auth/logout", {
    refreshToken,
  });

  return response.data;
};
