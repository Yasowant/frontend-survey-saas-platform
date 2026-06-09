export type SurveyStatus = "draft" | "published" | "archived";
export type QuestionType =
  | "text" | "number" | "email" | "phone" | "dropdown"
  | "radio" | "checkbox" | "date" | "file" | "rating";

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

export interface Rule {
  id: string;
  ifQuestionId: string;
  ifValue: string;
  thenAction: "show" | "hide";
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

export interface AuthState {
  user: User | null;
  token: string | null;
}

export type PlanId = "free" | "basic" | "premium";
export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  surveys: string;
  responses: string;
  features: string[];
}

export interface Subscription {
  planId: PlanId;
  startedAt: string;
  renewsAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  plan: PlanId;
  method: string;
}

export interface Notification {
  id: string;
  type: "survey_created" | "survey_published" | "subscription_updated" | "payment_success";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
}

// ---------- Admin / Management entities ----------
export type UserStatus = "active" | "inactive" | "suspended";

export interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roleId: string;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface Permission {
  id: string;
  key: string;       // e.g. "surveys.create"
  name: string;
  description: string;
  module: string;    // e.g. "Surveys"
}

export interface RoleRecord {
  id: string;
  name: string;
  description: string;
  permissionIds: string[];
  createdAt: string;
}

export type PlanStatus = "active" | "inactive";
export type PlanDuration = "monthly" | "yearly";

export interface PlanRecord {
  id: string;
  name: string;
  price: number;
  duration: PlanDuration;
  features: string[];
  limits: {
    surveys: number;
    responses: number;
    users: number;
  };
  status: PlanStatus;
  createdAt: string;
}
