import { getProfile, loginUser, logout, registerUser, verifyEmail } from "../api/auth.api";

export const authService = {
  register: registerUser,
  login: loginUser,
  logout: logout,
  verifyEmail: verifyEmail,
  getProfile,
};
