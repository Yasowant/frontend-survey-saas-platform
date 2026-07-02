export type SurveyStatus = "draft" | "published" | "archived";
export type QuestionType =
  | "text"
  | "number"
  | "email"
  | "phone"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "date"
  | "file"
  | "rating";

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  required?: boolean;
  options?: string[];
  sectionId: string;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
}

export type RuleOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "IS_EMPTY"
  | "IS_NOT_EMPTY";

export type RuleAction = "SHOW" | "HIDE" | "REQUIRE" | "OPTIONAL" | "ENABLE" | "DISABLE";

export interface Rule {
  id: string;
  ifQuestionId: string;
  operator: RuleOperator;
  ifValue: string;
  thenAction: RuleAction;
  thenQuestionId: string;
}

export interface Survey {
  id: string;
  name: string;
  description: string;
  category: string;
  status: SurveyStatus;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
  questions: Question[];
  rules: Rule[];
  responseCount: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Record<string, unknown>;
  submittedAt: string;
  durationSec: number;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: "Admin" | "Editor" | "Viewer";
  avatar?: string;
}
