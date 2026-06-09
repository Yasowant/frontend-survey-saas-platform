import { useQuery } from "@tanstack/react-query";
import { surveyService } from "../services/survey.service";

export const useSurveys = () => {
  return useQuery({
    queryKey: ["surveys"],
    queryFn: surveyService.getSurveys,
  });
};
