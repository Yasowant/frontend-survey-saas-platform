import { useMutation } from "@tanstack/react-query";
import { createRule } from "../services/rule.service";

export const useCreateRule = () => {
  return useMutation({
    mutationFn: createRule,
  });
};
