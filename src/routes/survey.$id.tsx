import { createFileRoute, useParams } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { usePublicSurvey } from "@/features/surveys/hooks/usePublicSurvey";
import { useSubmitPublicSurvey } from "@/features/surveys/hooks/useSubmitPublicSurvey";
import {
  computeQuestionStates,
  isEmptyValue,
  type EngineQuestion,
  type EngineRule,
} from "@/lib/rule-engine";
import { toast } from "sonner";

export const Route = createFileRoute("/survey/$id")({
  component: PublicSurvey,
});

function PublicSurvey() {
  const { id } = useParams({
    from: "/survey/$id",
  });

  const { data, isLoading, isError, error } = usePublicSurvey(id);
  const { mutate: submitResponse, isPending } = useSubmitPublicSurvey();

  const survey = data?.data;

  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const allQuestions: EngineQuestion[] = useMemo(
    () =>
      (survey?.sections ?? []).flatMap((section: any) =>
        (section.questions ?? []).map((q: any) => ({
          _id: q._id,
          sectionId: section._id,
          required: q.required,
        })),
      ),
    [survey],
  );

  const rules: EngineRule[] = useMemo(
    () =>
      (survey?.rules ?? []).map((r: any) => ({
        sourceQuestionId: String(r.sourceQuestionId),
        targetQuestionId: r.targetQuestionId ? String(r.targetQuestionId) : null,
        targetSectionId: r.targetSectionId ? String(r.targetSectionId) : null,
        operator: r.operator,
        value: r.value,
        action: r.action,
        order: r.order,
        isActive: r.isActive,
      })),
    [survey],
  );

  const questionStates = useMemo(
    () => computeQuestionStates(rules, allQuestions, answers),
    [rules, allQuestions, answers],
  );

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading survey...</div>;
  }

  if (isError || !survey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Card className="p-8 text-center">
          <CardTitle>Survey unavailable</CardTitle>
          <CardDescription className="mt-2">
            {(error as any)?.response?.data?.message ||
              "This survey does not exist or is not currently accepting responses."}
          </CardDescription>
        </Card>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-accent/30 p-6">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
            <Check className="h-7 w-7 text-green-500" />
          </div>

          <h2 className="mt-4 text-2xl font-semibold">Thank you!</h2>

          <p className="mt-2 text-sm text-muted-foreground">Your response has been recorded.</p>
        </Card>
      </div>
    );
  }

  const setAnswer = (questionId: string, value: any) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const handleSubmit = () => {
    // Client-side validation using the rule engine: required questions that
    // are visible and enabled must be answered.
    const missing: string[] = [];
    for (const section of survey.sections ?? []) {
      for (const question of section.questions ?? []) {
        const state = questionStates[question._id];
        if (!state || !state.visible || !state.enabled) continue;
        if (state.required && isEmptyValue(answers[question._id])) {
          missing.push(question.title);
        }
      }
    }

    if (missing.length > 0) {
      toast.error(`Please answer: ${missing.join(", ")}`);
      return;
    }

    const payload = {
      surveyId: survey._id,
      answers: Object.entries(answers)
        .filter(([questionId]) => {
          const state = questionStates[questionId];
          return state ? state.visible && state.enabled : true;
        })
        .map(([questionId, value]) => ({
          questionId,
          value,
        })),
    };

    submitResponse(payload, {
      onSuccess: () => {
        toast.success("Response submitted successfully");
        setDone(true);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to submit response");
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Powered by Survesy
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{survey.title}</CardTitle>

            <CardDescription>{survey.description || "No description available"}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {survey.sections?.map((section: any) => {
              const visibleQuestions = (section.questions ?? []).filter(
                (question: any) => questionStates[question._id]?.visible !== false,
              );

              if (visibleQuestions.length === 0) return null;

              return (
                <div
                  key={section._id}
                  className="rounded-xl border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >
                  {/* Section Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{section.title}</h3>

                      <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {visibleQuestions.length} Questions
                      </span>
                    </div>

                    {section.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                    )}
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {visibleQuestions.map((question: any) => {
                      const state = questionStates[question._id];
                      const disabled = state ? !state.enabled : false;
                      const required = state ? state.required : Boolean(question.required);

                      return (
                        <div
                          key={question._id}
                          className={`rounded-lg border bg-background p-4 transition-colors hover:bg-muted/30 ${
                            disabled ? "pointer-events-none opacity-50" : ""
                          }`}
                        >
                          <label className="mb-3 block text-sm font-medium">
                            {question.title}

                            {required && <span className="ml-1 text-red-500">*</span>}
                          </label>

                          {/* TEXT / EMAIL / PHONE */}
                          {["TEXT", "EMAIL", "PHONE"].includes(question.type) && (
                            <Input
                              type={
                                question.type === "EMAIL"
                                  ? "email"
                                  : question.type === "PHONE"
                                    ? "tel"
                                    : "text"
                              }
                              disabled={disabled}
                              value={(answers[question._id] as string) || ""}
                              placeholder={question.placeholder || "Enter answer"}
                              onChange={(e) => setAnswer(question._id, e.target.value)}
                            />
                          )}

                          {/* TEXTAREA */}
                          {question.type === "TEXTAREA" && (
                            <textarea
                              className="min-h-[100px] w-full rounded-md border p-3"
                              disabled={disabled}
                              value={(answers[question._id] as string) || ""}
                              onChange={(e) => setAnswer(question._id, e.target.value)}
                            />
                          )}

                          {/* NUMBER */}
                          {question.type === "NUMBER" && (
                            <Input
                              type="number"
                              disabled={disabled}
                              value={(answers[question._id] as string) || ""}
                              onChange={(e) => setAnswer(question._id, e.target.value)}
                            />
                          )}

                          {/* DATE */}
                          {question.type === "DATE" && (
                            <Input
                              type="date"
                              disabled={disabled}
                              value={(answers[question._id] as string) || ""}
                              onChange={(e) => setAnswer(question._id, e.target.value)}
                            />
                          )}

                          {/* DROPDOWN */}
                          {question.type === "DROPDOWN" && (
                            <Select
                              disabled={disabled}
                              value={(answers[question._id] as string) || ""}
                              onValueChange={(value) => setAnswer(question._id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select option" />
                              </SelectTrigger>

                              <SelectContent>
                                {question.options?.map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {/* RADIO */}
                          {question.type === "RADIO" && (
                            <RadioGroup
                              disabled={disabled}
                              value={(answers[question._id] as string) || ""}
                              onValueChange={(value) => setAnswer(question._id, value)}
                            >
                              {question.options?.map((option: string) => (
                                <div key={option} className="flex items-center gap-2">
                                  <RadioGroupItem value={option} id={`${question._id}-${option}`} />

                                  <label htmlFor={`${question._id}-${option}`}>{option}</label>
                                </div>
                              ))}
                            </RadioGroup>
                          )}

                          {/* CHECKBOX (multi-select) */}
                          {question.type === "CHECKBOX" && (
                            <div className="space-y-2">
                              {question.options?.map((option: string) => {
                                const arr = Array.isArray(answers[question._id])
                                  ? (answers[question._id] as string[])
                                  : [];
                                const checked = arr.includes(option);
                                return (
                                  <div key={option} className="flex items-center gap-2">
                                    <Checkbox
                                      id={`${question._id}-${option}`}
                                      disabled={disabled}
                                      checked={checked}
                                      onCheckedChange={(c) =>
                                        setAnswer(
                                          question._id,
                                          c ? [...arr, option] : arr.filter((x) => x !== option),
                                        )
                                      }
                                    />
                                    <label htmlFor={`${question._id}-${option}`}>{option}</label>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* RATING */}
                          {question.type === "RATING" && (
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                  type="button"
                                  key={n}
                                  disabled={disabled}
                                  onClick={() => setAnswer(question._id, n)}
                                  className={`h-8 w-8 rounded-md border text-sm ${
                                    Number(answers[question._id]) >= n
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-background"
                                  }`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <Button className="w-full" disabled={isPending} onClick={handleSubmit}>
              {isPending ? "Submitting..." : "Submit Survey"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
