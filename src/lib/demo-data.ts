import {
  KEYS, read, write, uid,
  surveysRepo, responsesRepo, invoicesRepo, notifRepo, auditRepo,
} from "./storage";
import type {
  Survey, Question, Section, SurveyResponse,
  Invoice, Notification, AuditLog, User,
} from "./types";

const CATEGORIES = ["Customer Feedback", "Employee", "Product", "Market Research", "Event"];
const QTYPES: Question["type"][] = ["text", "number", "email", "radio", "checkbox", "rating", "dropdown", "date"];
const NAMES = ["Onboarding NPS", "Q1 Pulse", "Feature Voting", "Exit Interview", "Event Feedback",
  "Customer Health", "Brand Awareness", "Pricing Sensitivity", "Site Usability", "Support CSAT"];

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function makeSurvey(i: number): Survey {
  const sectionId = uid();
  const sections: Section[] = [
    { id: sectionId, title: "General", description: "Tell us about yourself" },
  ];
  const questions: Question[] = Array.from({ length: randInt(3, 8) }).map((_, qi) => ({
    id: uid(),
    sectionId,
    type: rand(QTYPES),
    label: `Question ${qi + 1}: ${rand(["How satisfied are you?", "Rate our service", "Your email", "Pick one option", "Date of visit"])}`,
    required: Math.random() > 0.5,
    options: ["Option A", "Option B", "Option C"],
  }));
  const created = new Date(Date.now() - randInt(1, 120) * 86400000);
  return {
    id: uid(),
    name: `${rand(NAMES)} #${i + 1}`,
    description: "Auto-generated demo survey",
    category: rand(CATEGORIES),
    status: rand(["draft", "published", "published", "published", "archived"] as const),
    createdAt: created.toISOString(),
    updatedAt: created.toISOString(),
    sections,
    questions,
    rules: [],
    responseCount: randInt(0, 250),
  };
}

function makeResponse(survey: Survey): SurveyResponse {
  const answers: Record<string, unknown> = {};
  survey.questions.forEach((q) => {
    answers[q.id] = q.type === "rating" ? randInt(1, 5)
      : q.type === "number" ? randInt(1, 100)
      : q.type === "checkbox" ? [rand(q.options ?? ["A"])]
      : rand(q.options ?? ["Sample answer"]);
  });
  return {
    id: uid(),
    surveyId: survey.id,
    answers,
    submittedAt: new Date(Date.now() - randInt(1, 90) * 86400000).toISOString(),
    durationSec: randInt(30, 600),
    completed: Math.random() > 0.1,
  };
}

function makeInvoice(i: number): Invoice {
  return {
    id: uid(),
    number: `INV-${String(1000 + i).padStart(5, "0")}`,
    date: new Date(Date.now() - i * 30 * 86400000).toISOString(),
    amount: rand([0, 29, 99, 29, 99]),
    status: rand(["paid", "paid", "paid", "pending", "failed"] as const),
    plan: rand(["free", "basic", "premium"] as const),
    method: rand(["UPI", "Credit Card", "Debit Card", "Net Banking"]),
  };
}

function makeNotification(i: number): Notification {
  const types: Notification["type"][] = [
    "survey_created", "survey_published", "subscription_updated", "payment_success",
  ];
  const t = types[i % types.length];
  const map = {
    survey_created: { title: "Survey created", message: "A new draft survey was created." },
    survey_published: { title: "Survey published", message: "Your survey is now live." },
    subscription_updated: { title: "Subscription updated", message: "Your plan was changed." },
    payment_success: { title: "Payment received", message: "Your payment was processed successfully." },
  } as const;
  return {
    id: uid(),
    type: t,
    ...map[t],
    read: Math.random() > 0.4,
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
  };
}

function makeAudit(i: number): AuditLog {
  return {
    id: uid(),
    user: rand(["alex@acme.com", "sam@acme.com", "jordan@acme.com", "demo@user.com"]),
    action: rand(["Created survey", "Published survey", "Updated profile", "Logged in", "Deleted response", "Upgraded plan"]),
    module: rand(["Surveys", "Auth", "Billing", "Profile", "Responses"]),
    timestamp: new Date(Date.now() - i * 1800_000).toISOString(),
  };
}

export function seedDemoData(force = false) {
  if (typeof window === "undefined") return;
  if (!force && localStorage.getItem(KEYS.seeded)) return;

  const surveys = Array.from({ length: 50 }).map((_, i) => makeSurvey(i));
  write(KEYS.surveys, surveys);

  const responses: SurveyResponse[] = [];
  surveys.forEach((s) => {
    const n = randInt(2, 15);
    for (let i = 0; i < n; i++) responses.push(makeResponse(s));
  });
  write(KEYS.responses, responses.slice(0, 500));

  const invoices = Array.from({ length: 20 }).map((_, i) => makeInvoice(i));
  write(KEYS.invoices, invoices);

  const notifs = Array.from({ length: 100 }).map((_, i) => makeNotification(i));
  write(KEYS.notifications, notifs);

  const audits = Array.from({ length: 200 }).map((_, i) => makeAudit(i));
  write(KEYS.audit, audits);

  const users: User[] = [
    { id: uid(), name: "Demo User", email: "demo@user.com", company: "Acme Inc", role: "Admin" },
    { id: uid(), name: "Alex Carter", email: "alex@acme.com", company: "Acme Inc", role: "Editor" },
  ];
  write(KEYS.users, users);

  localStorage.setItem(KEYS.seeded, "1");
}

export { surveysRepo, responsesRepo, invoicesRepo, notifRepo, auditRepo };
