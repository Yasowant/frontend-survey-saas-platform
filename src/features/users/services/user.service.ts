import * as userApi from "../api/user.api";

export const userService = {
  getUsers: userApi.getUsers,
  getUserById: userApi.getUserById,
};
