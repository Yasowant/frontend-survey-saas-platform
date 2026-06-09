import { useQuery } from "@tanstack/react-query";

import { userService } from "../services/user.service";

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],

    queryFn: () => userService.getUserById(id),

    enabled: !!id,
  });
};
