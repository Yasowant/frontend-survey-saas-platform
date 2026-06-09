import { useMutation } from "@tanstack/react-query";
import { createQuestion } from "../services/question.service";

export const useCreateQuestion = () => {
  return useMutation({
    mutationFn: createQuestion,
  });
};
