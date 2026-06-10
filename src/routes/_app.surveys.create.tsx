import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronLeft, ChevronRight, GripVertical, Plus, Trash2 } from "lucide-react";
import { surveysRepo, uid, auditRepo, notifRepo } from "@/lib/storage";
import type { Question, Section, QuestionType, Rule } from "@/lib/types";
import { useCreateSurvey } from "@/features/surveys/hooks/useCreateSurvey";
import { toast } from "sonner";
import { useCreateSection } from "@/features/surveys/hooks/useCreateSection";
import { useCreateQuestion } from "@/features/surveys/hooks/useCreateQuestion";
import { useCreateRule } from "@/features/surveys/hooks/useCreateRules";

export const Route = createFileRoute("/_app/surveys/create")({ component: CreateSurvey });

const QTYPES: QuestionType[] = [
  "text",
  "number",
  "email",
  "phone",
  "dropdown",
  "radio",
  "checkbox",
  "date",
  "file",
  "rating",
];
const STEPS = ["Information", "Build", "Preview", "Publish"];

function CreateSurvey() {
  const navigate = useNavigate();
  const { mutateAsync: createSurvey, isPending } = useCreateSurvey();
  const { mutateAsync: createSection } = useCreateSection();
  const { mutateAsync: createQuestion } = useCreateQuestion();
  const { mutateAsync: createRule } = useCreateRule();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Customer Feedback");
  const [sections, setSections] = useState<Section[]>([
    { id: uid(), title: "General", description: "" },
  ]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);

  const addSection = () =>
    setSections([...sections, { id: uid(), title: "New section", description: "" }]);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...questions];
    const t = next[idx + dir];
    if (!t) return;
    next[idx + dir] = next[idx];
    next[idx] = t;
    setQuestions(next);
  };

  const publish = async (status: "DRAFT" | "PUBLISHED") => {
    try {
      // 1. Create Survey
      const surveyRes = await createSurvey({
        title: name,
        description: desc,
        status,
        settings: {
          allowAnonymousResponses: true,
          allowMultipleResponses: false,
        },
      });

      const surveyId = surveyRes.data._id;

      // Frontend Section ID -> Backend Section ID
      const sectionMap = new Map<string, string>();

      // Frontend Question ID -> Backend Question ID
      const questionMap = new Map<string, string>();

      // =====================================================
      // CREATE SECTIONS
      // =====================================================

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];

        const sectionRes = await createSection({
          surveyId,
          title: section.title,
          description: section.description || "",
          order: i + 1,
        });

        sectionMap.set(section.id, sectionRes.data._id);
      }

      // =====================================================
      // CREATE QUESTIONS
      // =====================================================

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];

        const questionRes = await createQuestion({
          surveyId,

          sectionId: sectionMap.get(question.sectionId)!,

          title: question.label,

          description: "",

          type: question.type.toUpperCase(),

          required: question.required ?? false,

          options: question.options || [],

          placeholder: "",

          order: i + 1,
        });

        questionMap.set(question.id, questionRes.data._id);
      }

      // =====================================================
      // CREATE RULES
      // =====================================================

      if (rules.length > 0) {
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];

          await createRule({
            surveyId,

            sourceQuestionId: questionMap.get(rule.ifQuestionId),

            targetQuestionId: questionMap.get(rule.thenQuestionId),

            targetSectionId: null,

            operator: "EQUALS",

            value: rule.ifValue,

            action: rule.thenAction === "show" ? "SHOW" : "HIDE",

            order: i + 1,

            isActive: true,
          });
        }
      }

      toast.success(
        status === "PUBLISHED" ? "Survey published successfully" : "Survey saved as draft",
      );

      navigate({
        to: "/surveys",
      });
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to create survey");
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    const sectionQuestionIds = questions.filter((q) => q.sectionId === sectionId).map((q) => q.id);
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setQuestions((prev) => prev.filter((q) => q.sectionId !== sectionId));
    setRules((prev) =>
      prev.filter(
        (r) =>
          !sectionQuestionIds.includes(r.ifQuestionId) &&
          !sectionQuestionIds.includes(r.thenQuestionId),
      ),
    );
    toast.success("Section deleted");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create survey</h1>
        <p className="text-sm text-muted-foreground">Build your survey in a few steps.</p>
      </div>

      {/* stepper */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(i)}
                  className={`flex h-8 items-center gap-2 rounded-full px-3 text-xs font-medium transition ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/40 text-[10px]">
                    {i < step ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  {s}
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Survey information</CardTitle>
            <CardDescription>Basic details about your survey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Survey name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Customer Satisfaction Q3"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Customer Feedback", "Employee", "Product", "Market Research", "Event"].map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <>
          {/* Sections */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sections</CardTitle>
                <CardDescription>Group your questions</CardDescription>
              </div>
              <Button onClick={addSection} size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add section
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map((s, i) => (
                <div key={s.id} className="flex items-start gap-2 rounded-md border p-3">
                  <GripVertical className="mt-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={s.title}
                      onChange={(e) => {
                        const n = [...sections];
                        n[i] = { ...s, title: e.target.value };
                        setSections(n);
                      }}
                      placeholder="Section title"
                    />
                    <Input
                      value={s.description ?? ""}
                      onChange={(e) => {
                        const n = [...sections];
                        n[i] = { ...s, description: e.target.value };
                        setSections(n);
                      }}
                      placeholder="Description (optional)"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSection(s.id)}
                    disabled={sections.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Questions */}

          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>
                Add questions per section · {questions.length} total
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {sections.map((s) => {
                const sectionQuestions = questions.filter((q) => q.sectionId === s.id);
                const addQ = () =>
                  setQuestions([
                    ...questions,
                    {
                      id: uid(),
                      type: "text",
                      label: "Untitled question",
                      sectionId: s.id,
                      options: ["Option 1", "Option 2"],
                    },
                  ]);
                return (
                  <div key={s.id} className="rounded-lg border bg-muted/20 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{s.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {sectionQuestions.length} question(s)
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={addQ}>
                        <Plus className="mr-1 h-4 w-4" /> Add question
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {sectionQuestions.length === 0 ? (
                        <div className="rounded-md border border-dashed p-6 text-center text-xs text-muted-foreground">
                          No questions in this section yet.
                        </div>
                      ) : (
                        sectionQuestions.map((q) => {
                          const i = questions.findIndex((x) => x.id === q.id);
                          return (
                            <div
                              key={q.id}
                              className="flex items-start gap-2 rounded-md border bg-background p-3"
                            >
                              <div className="flex flex-col">
                                <button
                                  onClick={() => move(i, -1)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <ChevronLeft className="h-3 w-3 rotate-90" />
                                </button>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <button
                                  onClick={() => move(i, 1)}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <ChevronRight className="h-3 w-3 rotate-90" />
                                </button>
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex flex-wrap gap-2">
                                  <Input
                                    value={q.label}
                                    className="min-w-[180px] flex-1"
                                    onChange={(e) => {
                                      const n = [...questions];
                                      n[i] = { ...q, label: e.target.value };
                                      setQuestions(n);
                                    }}
                                  />
                                  <Select
                                    value={q.type}
                                    onValueChange={(v) => {
                                      const n = [...questions];
                                      n[i] = { ...q, type: v as QuestionType };
                                      setQuestions(n);
                                    }}
                                  >
                                    <SelectTrigger className="w-36">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {QTYPES.map((t) => (
                                        <SelectItem key={t} value={t}>
                                          {t}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={q.sectionId}
                                    onValueChange={(v) => {
                                      const n = [...questions];
                                      n[i] = { ...q, sectionId: v };
                                      setQuestions(n);
                                    }}
                                  >
                                    <SelectTrigger className="w-40">
                                      <SelectValue placeholder="Section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {sections.map((sec) => (
                                        <SelectItem key={sec.id} value={sec.id}>
                                          {sec.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {["dropdown", "radio", "checkbox"].includes(q.type) && (
                                  <Input
                                    value={q.options?.join(", ") ?? ""}
                                    onChange={(e) => {
                                      const n = [...questions];
                                      n[i] = {
                                        ...q,
                                        options: e.target.value.split(",").map((s) => s.trim()),
                                      };
                                      setQuestions(n);
                                    }}
                                    placeholder="Options, comma-separated"
                                  />
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setQuestions(questions.filter((x) => x.id !== q.id))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
              {sections.length === 0 && (
                <div className="rounded-md border border-dashed p-12 text-center text-sm text-muted-foreground">
                  Add a section first to start adding questions.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rules */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rules engine</CardTitle>
                <CardDescription>Show or hide questions based on answers</CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() =>
                  questions.length >= 2 &&
                  setRules([
                    ...rules,
                    {
                      id: uid(),
                      ifQuestionId: questions[0].id,
                      ifValue: "Yes",
                      thenAction: "show",
                      thenQuestionId: questions[1].id,
                    },
                  ])
                }
              >
                <Plus className="mr-1 h-4 w-4" /> Add rule
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {questions.length < 2 ? (
                <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Add at least 2 questions to create rules.
                </div>
              ) : rules.length === 0 ? (
                <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No rules yet.
                </div>
              ) : (
                rules.map((r, i) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center gap-2 rounded-md border p-3 text-sm"
                  >
                    <Badge variant="outline">IF</Badge>
                    <Select
                      value={r.ifQuestionId}
                      onValueChange={(v) => {
                        const n = [...rules];
                        n[i] = { ...r, ifQuestionId: v };
                        setRules(n);
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {questions.map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.label.slice(0, 30)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span>=</span>
                    <Input
                      value={r.ifValue}
                      onChange={(e) => {
                        const n = [...rules];
                        n[i] = { ...r, ifValue: e.target.value };
                        setRules(n);
                      }}
                      className="w-32"
                    />
                    <Badge variant="outline">THEN</Badge>
                    <Select
                      value={r.thenAction}
                      onValueChange={(v) => {
                        const n = [...rules];
                        n[i] = { ...r, thenAction: v as "show" | "hide" };
                        setRules(n);
                      }}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="show">Show</SelectItem>
                        <SelectItem value="hide">Hide</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={r.thenQuestionId}
                      onValueChange={(v) => {
                        const n = [...rules];
                        n[i] = { ...r, thenQuestionId: v };
                        setRules(n);
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {questions.map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.label.slice(0, 30)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      onClick={() => setRules(rules.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}

      {step === 2 && (
        <PreviewRunner
          name={name}
          desc={desc}
          sections={sections}
          questions={questions}
          rules={rules}
        />
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Publish</CardTitle>
            <CardDescription>Save as draft or publish your survey</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button variant="outline" onClick={() => publish("DRAFT")} disabled={isPending}>
              Save as Draft
            </Button>

            <Button onClick={() => publish("PUBLISHED")} disabled={isPending}>
              Publish Survey
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
          disabled={step === STEPS.length - 1}
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function PreviewRunner({
  name,
  desc,
  sections,
  questions,
  rules,
}: {
  name: string;
  desc: string;
  sections: Section[];
  questions: Question[];
  rules: Rule[];
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const visibleQuestions = useMemo(() => {
    const visibility: Record<string, boolean> = {};
    for (const q of questions) visibility[q.id] = true;
    // show-targets default hidden
    const showTargets = new Set(
      rules.filter((r) => r.thenAction === "show").map((r) => r.thenQuestionId),
    );
    for (const id of showTargets) visibility[id] = false;
    for (const r of rules) {
      const a = answers[r.ifQuestionId];
      const match = Array.isArray(a)
        ? a.map(String).includes(r.ifValue)
        : String(a ?? "").toLowerCase() === r.ifValue.toLowerCase();
      if (!match) continue;
      visibility[r.thenQuestionId] = r.thenAction === "show";
    }
    return visibility;
  }, [questions, rules, answers]);

  if (sections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{name || "Untitled survey"}</CardTitle>
          <CardDescription>{desc || "Preview"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
            Add sections and questions to preview.
          </div>
        </CardContent>
      </Card>
    );
  }

  const section = sections[Math.min(idx, sections.length - 1)];
  const sectionQs = questions.filter((q) => q.sectionId === section.id && visibleQuestions[q.id]);
  const setAns = (id: string, v: unknown) => setAnswers((a) => ({ ...a, [id]: v }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name || "Untitled survey"}</CardTitle>
        <CardDescription>
          {desc || "Live preview · rules are evaluated as you answer"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Section {idx + 1} of {sections.length}
          </span>
          <span>{sectionQs.length} question(s)</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${((idx + 1) / sections.length) * 100}%` }}
          />
        </div>

        <div>
          <h3 className="text-base font-semibold">{section.title}</h3>
          {section.description && (
            <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {sectionQs.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-xs text-muted-foreground">
              No visible questions in this section.
            </div>
          ) : (
            sectionQs.map((q) => {
              const val = answers[q.id];
              return (
                <div key={q.id} className="space-y-2 rounded-md border p-3">
                  <Label className="text-sm font-medium">{q.label}</Label>
                  {(q.type === "text" || q.type === "email" || q.type === "phone") && (
                    <Input
                      type={q.type === "email" ? "email" : "text"}
                      value={(val as string) ?? ""}
                      onChange={(e) => setAns(q.id, e.target.value)}
                    />
                  )}
                  {q.type === "number" && (
                    <Input
                      type="number"
                      value={(val as string) ?? ""}
                      onChange={(e) => setAns(q.id, e.target.value)}
                    />
                  )}
                  {q.type === "date" && (
                    <Input
                      type="date"
                      value={(val as string) ?? ""}
                      onChange={(e) => setAns(q.id, e.target.value)}
                    />
                  )}
                  {q.type === "file" && (
                    <Input
                      type="file"
                      onChange={(e) => setAns(q.id, e.target.files?.[0]?.name ?? "")}
                    />
                  )}
                  {q.type === "dropdown" && (
                    <Select value={(val as string) ?? ""} onValueChange={(v) => setAns(q.id, v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {(q.options ?? []).map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {q.type === "radio" && (
                    <RadioGroup
                      value={(val as string) ?? ""}
                      onValueChange={(v) => setAns(q.id, v)}
                    >
                      {(q.options ?? []).map((o) => (
                        <div key={o} className="flex items-center gap-2">
                          <RadioGroupItem value={o} id={`${q.id}-${o}`} />
                          <Label htmlFor={`${q.id}-${o}`} className="font-normal">
                            {o}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {q.type === "checkbox" && (
                    <div className="space-y-2">
                      {(q.options ?? []).map((o) => {
                        const arr = Array.isArray(val) ? (val as string[]) : [];
                        const checked = arr.includes(o);
                        return (
                          <div key={o} className="flex items-center gap-2">
                            <Checkbox
                              id={`${q.id}-${o}`}
                              checked={checked}
                              onCheckedChange={(c) => {
                                const next = c ? [...arr, o] : arr.filter((x) => x !== o);
                                setAns(q.id, next);
                              }}
                            />
                            <Label htmlFor={`${q.id}-${o}`} className="font-normal">
                              {o}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {q.type === "rating" && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          type="button"
                          key={n}
                          onClick={() => setAns(q.id, n)}
                          className={`h-8 w-8 rounded-md border text-sm ${Number(val) >= n ? "bg-primary text-primary-foreground" : "bg-background"}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIdx(Math.max(0, idx - 1))}
            disabled={idx === 0}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
          </Button>
          <Button
            size="sm"
            onClick={() => setIdx(Math.min(sections.length - 1, idx + 1))}
            disabled={idx >= sections.length - 1}
          >
            Next section <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
