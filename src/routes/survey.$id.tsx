import { createFileRoute, useParams } from "@tanstack/react-router";
import { Check, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useSurvey } from "@/features/surveys/hooks/useSurvey";
import { useSubmitSurvey } from "@/features/surveys/hooks/useSubmitSurvey";
import { toast } from "sonner";
import { useDeleteSection } from "@/features/surveys/hooks/useDeleteSection";

export const Route = createFileRoute("/survey/$id")({
  component: PublicSurvey,
});

function PublicSurvey() {
  const { id } = useParams({
    from: "/survey/$id",
  });

  const { data, isLoading, isError } = useSurvey(id);
  const { mutate: submitResponse, isPending } = useSubmitSurvey();
  const deleteSectionMutation = useDeleteSection();

  const survey = data?.data;

  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading survey...</div>;
  }

  if (isError || !survey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Card className="p-8 text-center">
          <CardTitle>Survey not found</CardTitle>
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
            {survey.sections?.map((section: any) => (
              <div
                key={section._id}
                className="
      group
      relative
      rounded-xl
      border
      bg-card
      p-5
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-primary/30
      hover:shadow-lg
    "
              >
                {/* Section Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{section.title}</h3>

                      <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {section.questions?.length || 0} Questions
                      </span>
                    </div>

                    {section.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                    )}
                  </div>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="
          opacity-0
          transition-all
          duration-200
          group-hover:opacity-100
        "
                    onClick={() => {
                      if (confirm("Delete this section and all related questions?")) {
                        deleteSectionMutation.mutate(section._id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {section.questions?.map((question: any) => {
                    const rules = survey.rules || [];

                    const showRule = rules.find(
                      (rule: any) =>
                        rule.targetQuestionId === question._id && rule.action === "SHOW",
                    );

                    if (showRule) {
                      const sourceAnswer = answers[showRule.sourceQuestionId];

                      if (sourceAnswer !== showRule.value) {
                        return null;
                      }
                    }

                    return (
                      <div
                        key={question._id}
                        className="
              rounded-lg
              border
              bg-background
              p-4
              transition-colors
              hover:bg-muted/30
            "
                      >
                        <label className="mb-3 block text-sm font-medium">
                          {question.title}

                          {question.required && <span className="ml-1 text-red-500">*</span>}
                        </label>

                        {/* TEXT */}
                        {question.type === "TEXT" && (
                          <Input
                            value={(answers[question._id] as string) || ""}
                            placeholder={question.placeholder || "Enter answer"}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question._id]: e.target.value,
                              }))
                            }
                          />
                        )}

                        {/* TEXTAREA */}
                        {question.type === "TEXTAREA" && (
                          <textarea
                            className="min-h-[100px] w-full rounded-md border p-3"
                            value={(answers[question._id] as string) || ""}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question._id]: e.target.value,
                              }))
                            }
                          />
                        )}

                        {/* NUMBER */}
                        {question.type === "NUMBER" && (
                          <Input
                            type="number"
                            value={(answers[question._id] as string) || ""}
                            onChange={(e) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question._id]: e.target.value,
                              }))
                            }
                          />
                        )}

                        {/* DROPDOWN */}
                        {question.type === "DROPDOWN" && (
                          <Select
                            value={(answers[question._id] as string) || ""}
                            onValueChange={(value) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question._id]: value,
                              }))
                            }
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
                            value={(answers[question._id] as string) || ""}
                            onValueChange={(value) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question._id]: value,
                              }))
                            }
                          >
                            {question.options?.map((option: string) => (
                              <div key={option} className="flex items-center gap-2">
                                <RadioGroupItem value={option} id={`${question._id}-${option}`} />

                                <label htmlFor={`${question._id}-${option}`}>{option}</label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <Button
              className="w-full"
              disabled={isPending}
              onClick={() => {
                const payload = {
                  surveyId: survey._id,
                  answers: Object.entries(answers).map(([questionId, value]) => ({
                    questionId,
                    value,
                  })),
                };
                console.log(payload);
                submitResponse(payload, {
                  onSuccess: () => {
                    toast.success("Response submitted successfully");
                    setDone(true);
                  },
                  onError: (error: any) => {
                    toast.error(error?.response?.data?.message || "Failed to submit response");
                  },
                });
              }}
            >
              {isPending ? "Submitting..." : "Submit Survey"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
