import { api } from "@/shared/api/axios";

export const createRule = async (payload: {
  surveyId: string;
  sourceQuestionId: string;
  targetQuestionId?: string | null;
  targetSectionId?: string | null;
  operator:
    | "EQUALS"
    | "NOT_EQUALS"
    | "GREATER_THAN"
    | "LESS_THAN"
    | "CONTAINS"
    | "NOT_CONTAINS"
    | "IS_EMPTY"
    | "IS_NOT_EMPTY";
  value: any;
  action: "SHOW" | "HIDE" | "REQUIRE" | "OPTIONAL" | "ENABLE" | "DISABLE";
  order: number;
  isActive?: boolean;
}) => {
  const response = await api.post("/rules", payload);

  return response.data;
};
