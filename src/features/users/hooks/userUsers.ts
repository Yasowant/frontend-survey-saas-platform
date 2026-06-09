import { useQuery } from "@tanstack/react-query";

import { userService } from "../services/user.service";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],

    queryFn: userService.getUsers,
  });
};
