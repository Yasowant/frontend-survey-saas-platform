/**
 * Shared client-side rule engine — mirrors the backend implementation.
 *
 * Supports all operators (EQUALS, NOT_EQUALS, GREATER_THAN, LESS_THAN,
 * CONTAINS, NOT_CONTAINS, IS_EMPTY, IS_NOT_EMPTY) and all actions
 * (SHOW, HIDE, REQUIRE, OPTIONAL, ENABLE, DISABLE).
 *
 * Semantics:
 * - Questions targeted by at least one SHOW rule are hidden by default and
 *   become visible when any of their SHOW rules match.
 * - Rules are applied in ascending `order`; later rules win on conflict.
 * - Rules targeting a section apply to every question in that section.
 */

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

export const RULE_OPERATORS: { value: RuleOperator; label: string }[] = [
  { value: "EQUALS", label: "equals" },
  { value: "NOT_EQUALS", label: "does not equal" },
  { value: "GREATER_THAN", label: "is greater than" },
  { value: "LESS_THAN", label: "is less than" },
  { value: "CONTAINS", label: "contains" },
  { value: "NOT_CONTAINS", label: "does not contain" },
  { value: "IS_EMPTY", label: "is empty" },
  { value: "IS_NOT_EMPTY", label: "is not empty" },
];

export const RULE_ACTIONS: { value: RuleAction; label: string }[] = [
  { value: "SHOW", label: "Show" },
  { value: "HIDE", label: "Hide" },
  { value: "REQUIRE", label: "Require" },
  { value: "OPTIONAL", label: "Make optional" },
  { value: "ENABLE", label: "Enable" },
  { value: "DISABLE", label: "Disable" },
];

export interface EngineRule {
  sourceQuestionId: string;
  targetQuestionId?: string | null;
  targetSectionId?: string | null;
  operator: RuleOperator;
  value: unknown;
  action: RuleAction;
  order?: number;
  isActive?: boolean;
}

export interface EngineQuestion {
  _id: string;
  sectionId: string;
  required?: boolean;
}

export interface QuestionState {
  visible: boolean;
  required: boolean;
  enabled: boolean;
}

export const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return String(value).trim() === "";
};

export const evaluateCondition = (
  operator: RuleOperator,
  answer: unknown,
  ruleValue: unknown,
): boolean => {
  if (operator === "IS_EMPTY") return isEmptyValue(answer);
  if (operator === "IS_NOT_EMPTY") return !isEmptyValue(answer);

  if (isEmptyValue(answer)) return false;

  const answerArr = Array.isArray(answer) ? answer.map(String) : null;
  const answerStr = String(answer);
  const valueStr = String(ruleValue);

  switch (operator) {
    case "EQUALS":
      return answerArr ? answerArr.includes(valueStr) : answerStr === valueStr;
    case "NOT_EQUALS":
      return answerArr ? !answerArr.includes(valueStr) : answerStr !== valueStr;
    case "CONTAINS":
      return answerArr ? answerArr.some((v) => v.includes(valueStr)) : answerStr.includes(valueStr);
    case "NOT_CONTAINS":
      return answerArr
        ? !answerArr.some((v) => v.includes(valueStr))
        : !answerStr.includes(valueStr);
    case "GREATER_THAN":
      return Number(answer) > Number(ruleValue);
    case "LESS_THAN":
      return Number(answer) < Number(ruleValue);
    default:
      return false;
  }
};

const targetQuestions = (rule: EngineRule, questions: EngineQuestion[]): string[] => {
  if (rule.targetQuestionId) return [String(rule.targetQuestionId)];
  if (rule.targetSectionId) {
    return questions
      .filter((q) => String(q.sectionId) === String(rule.targetSectionId))
      .map((q) => String(q._id));
  }
  return [];
};

/** Computes visible/required/enabled state for every question. */
export const computeQuestionStates = (
  rules: EngineRule[],
  questions: EngineQuestion[],
  answers: Record<string, unknown>,
): Record<string, QuestionState> => {
  const states: Record<string, QuestionState> = {};
  for (const q of questions) {
    states[q._id] = {
      visible: true,
      required: Boolean(q.required),
      enabled: true,
    };
  }

  const activeRules = rules
    .filter((r) => r.isActive !== false)
    .sort((a, b) => (a.order ?? 1) - (b.order ?? 1));

  const showTargets = new Set<string>();
  for (const rule of activeRules) {
    if (rule.action !== "SHOW") continue;
    for (const q of targetQuestions(rule, questions)) showTargets.add(q);
  }
  for (const id of showTargets) {
    if (states[id]) states[id].visible = false;
  }

  for (const rule of activeRules) {
    const matched = evaluateCondition(
      rule.operator,
      answers[String(rule.sourceQuestionId)],
      rule.value,
    );
    if (!matched) continue;

    for (const id of targetQuestions(rule, questions)) {
      const state = states[id];
      if (!state) continue;
      switch (rule.action) {
        case "SHOW":
          state.visible = true;
          break;
        case "HIDE":
          state.visible = false;
          break;
        case "REQUIRE":
          state.required = true;
          break;
        case "OPTIONAL":
          state.required = false;
          break;
        case "ENABLE":
          state.enabled = true;
          break;
        case "DISABLE":
          state.enabled = false;
          break;
      }
    }
  }

  return states;
};
