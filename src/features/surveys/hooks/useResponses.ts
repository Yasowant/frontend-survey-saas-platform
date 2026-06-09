import { useQuery } from "@tanstack/react-query";

import { responseService } from "../services/response.service";

export const useResponses = () => {
  return useQuery({
    queryKey: ["responses"],
    queryFn: responseService.getResponses,
  });
};
