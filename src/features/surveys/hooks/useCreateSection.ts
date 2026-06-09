import { useMutation } from "@tanstack/react-query";
import { createSection } from "../services/section.service";

export const useCreateSection = () => {
  return useMutation({
    mutationFn: createSection,
  });
};
