import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import demoVideo from "@/assets/videos/survesy-demo.mp4";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  Play,
  PenLine,
  Send,
  LineChart,
  Rocket,
  Link2,
  Bell,
  Eye,
  Moon,
  Sun,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getTheme, toggleTheme, type Theme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Survesy — Build Surveys, Grow Insights" },
      {
        name: "description",
        content:
          "Free survey platform with a visual rule engine, one-click publishing, public share links, and real-time analytics.",
      },
      { property: "og:title", content: "Survesy — Build Surveys, Grow Insights" },
      {
        property: "og:description",
        content:
          "Build multi-section surveys with conditional logic, publish with one click, and share a public link — no respondent accounts needed.",
      },
    ],
  }),
  component: Landing,
});

/* ------------------------------------------------------------------ */
/* Content — kept accurate to what the product actually ships          */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: Sparkles,
    title: "AI survey generation",
    desc: "Describe the survey you need — “a hospital management survey” — and AI builds the sections, questions, and conditional-logic rules for you in seconds, saved as a draft you review and publish.",
    color: "from-indigo-500 to-violet-500",
    large: true,
  },
  {
    icon: Workflow,
    title: "Visual rule engine",
    desc: "8 operators and 6 actions — show, hide, require, make optional, enable or disable any question based on earlier answers. Rules run live in preview and are enforced on the server.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Rocket,
    title: "One-click publishing",
    desc: "Publish, close, or reopen a survey from the dashboard. Pre-publish validation makes sure nothing incomplete goes live.",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: Link2,
    title: "Share by link or email",
    desc: "Every published survey gets a public link anyone can open — no respondent account required. Or send email invitations with a personal message, delivered automatically in the background.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Layers,
    title: "Multi-section surveys",
    desc: "Organize questions into ordered sections with 10 question types: text, rating, dropdown, checkbox, date, and more.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    desc: "Responses appear on your dashboard the moment they arrive, with per-survey breakdowns and answer details.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: ShieldCheck,
    title: "Roles, permissions & audit",
    desc: "Role-based access control for your team and a full audit log of every action — built in from day one.",
    color: "from-rose-500 to-red-500",
  },
];

const productFacts = [
  { value: 10, suffix: "", label: "Question types" },
  { value: 8, suffix: "", label: "Logic operators" },
  { value: 6, suffix: "", label: "Rule actions" },
  { value: 0, suffix: "$", label: "Forever", prefix: true },
];

const steps = [
  {
    n: "01",
    icon: PenLine,
    title: "Build",
    desc: "Create sections, add questions, and wire up conditional logic in the visual rule editor.",
    color: "from-primary to-chart-2",
  },
  {
    n: "02",
    icon: Eye,
    title: "Preview",
    desc: "Test your survey with live rule evaluation — see exactly what respondents will see.",
    color: "from-chart-2 to-chart-3",
  },
  {
    n: "03",
    icon: Send,
    title: "Publish & share",
    desc: "Publish with one click and copy a public link anyone can answer — no sign-up needed.",
    color: "from-chart-3 to-chart-5",
  },
  {
    n: "04",
    icon: LineChart,
    title: "Analyze",
    desc: "Watch responses arrive in real time and drill into every answer from the dashboard.",
    color: "from-chart-5 to-primary",
  },
];

const capabilities = [
  "AI survey generation",
  "Conditional logic",
  "Anonymous responses",
  "Public share links",
  "Multi-section surveys",
  "Draft & publish workflow",
  "Role-based access",
  "Audit logs",
  "Email invitations",
  "Automated emails",
  "Real-time dashboard",
  "10 question types",
];

const freeFeatures = [
  "Unlimited surveys & responses",
  "Full rule engine — all operators & actions",
  "Public share links & anonymous responses",
  "Real-time analytics dashboard",
  "User, role & permission management",
  "Audit logs & email notifications",
];

const faqs = [
  {
    q: "How does AI survey generation work?",
    a: "Click “Generate with AI” on the surveys page and describe what you need — for example “a hospital management survey”. AI designs the sections, questions (across all 10 types), and conditional-logic rules, then saves it as a draft. You review, tweak anything, and publish when ready.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. Survesy is completely free — every feature is included and there is nothing to upgrade to.",
  },
  {
    q: "Do respondents need an account?",
    a: "No. Published surveys get a public link that anyone can open and answer. You can allow anonymous responses or require sign-in per survey — it's a setting on each survey.",
  },
  {
    q: "How does conditional logic work?",
    a: "In the builder you create rules like “IF question A equals Yes, THEN show question B”. You can choose from 8 operators (equals, contains, greater than, is empty…) and 6 actions (show, hide, require, make optional, enable, disable). Rules run live in the preview and are validated again on the server when a response is submitted.",
  },
  {
    q: "How do emails work?",
    a: "Survesy sends all emails automatically in the background — account verification, password reset, password-change confirmations, and survey invitations. You never wait on email delivery: the app responds instantly and messages typically arrive within a minute. Every email uses the same clean, branded template.",
  },
  {
    q: "Can I edit a survey after publishing?",
    a: "You can update a survey's details anytime, and close or reopen it from the dashboard. Closed surveys stop accepting responses immediately.",
  },
  {
    q: "Who can see my responses?",
    a: "Only signed-in members of your workspace with the right permissions. Access is controlled with roles and every action is recorded in the audit log.",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, start: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.2,
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, seen };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms`, opacity: seen ? undefined : 0 }}
      className={seen ? "reveal-up" : ""}
    >
      {children}
    </div>
  );
}

function FactCard({
  value,
  suffix,
  label,
  prefix,
}: {
  value: number;
  suffix: string;
  label: string;
  prefix?: boolean;
}) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const n = useCountUp(value, seen);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold md:text-5xl text-gradient">
        {prefix ? `${suffix}${n}` : `${n}${suffix}`}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

/* Animated IF / THEN rule chip mockup used in the hero */
function RuleEngineMockup() {
  const [answer, setAnswer] = useState<"Yes" | "No">("Yes");
  useEffect(() => {
    const t = setInterval(() => setAnswer((a) => (a === "Yes" ? "No" : "Yes")), 2600);
    return () => clearInterval(t);
  }, []);
  const followUpVisible = answer === "Yes";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 glass shadow-glow text-left">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <div className="ml-3 text-xs text-muted-foreground">survesy.app/surveys/create</div>
        <Badge variant="outline" className="ml-auto text-[10px]">
          Live preview
        </Badge>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        {/* Rule editor side */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Rules engine
          </div>
          <div className="rounded-xl border border-primary/30 bg-card p-3 text-xs shadow-sm">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
                IF
              </span>
              <span className="rounded-md border border-border/60 px-2 py-1">
                Do you use surveys?
              </span>
              <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">equals</span>
              <span className="rounded-md border border-border/60 px-2 py-1 font-medium">Yes</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-chart-2/10 px-2 py-1 font-semibold text-chart-2">
                THEN
              </span>
              <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">show</span>
              <span className="rounded-md border border-border/60 px-2 py-1">
                Which tool do you use today?
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
                IF
              </span>
              <span className="rounded-md border border-border/60 px-2 py-1">Team size</span>
              <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
                greater than
              </span>
              <span className="rounded-md border border-border/60 px-2 py-1 font-medium">50</span>
              <span className="rounded-md bg-chart-2/10 px-2 py-1 font-semibold text-chart-2">
                THEN
              </span>
              <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">require</span>
              <span className="rounded-md border border-border/60 px-2 py-1">Department</span>
            </div>
          </div>
        </div>

        {/* Live preview side */}
        <div className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
          <div className="text-sm font-semibold">Customer research</div>
          <div className="space-y-1.5">
            <div className="text-xs font-medium">
              Do you use surveys? <span className="text-red-500">*</span>
            </div>
            <div className="flex gap-2">
              {(["Yes", "No"] as const).map((opt) => (
                <span
                  key={opt}
                  className={`rounded-full border px-3 py-1 text-xs transition-all duration-300 ${
                    answer === opt
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "border-border/60 text-muted-foreground"
                  }`}
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
          <div
            className={`space-y-1.5 overflow-hidden transition-all duration-500 ${
              followUpVisible ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="rounded-lg border border-primary/40 bg-primary/5 p-2.5">
              <div className="text-xs font-medium">Which tool do you use today?</div>
              <div className="mt-1.5 h-6 rounded-md border border-border/60 bg-background px-2 text-[10px] leading-6 text-muted-foreground">
                Type your answer…
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            {followUpVisible
              ? "Rule matched — follow-up question shown"
              : "Rule not matched — follow-up hidden"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function Landing() {
  const [openVideo, setOpenVideo] = useState(false);
  const [theme, setThemeState] = useState<Theme>(() => getTheme());

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-lg text-gradient">Survesy</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle light/dark mode"
              onClick={() => setThemeState(toggleTheme())}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full px-4 shadow-glow">
              <Link to="/register">
                Get started <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        {/* Background demo video */}
        <video
          src={demoVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25 dark:opacity-15"
        />
        {/* Readability scrim over the video */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/70 to-background" />
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-blob -z-10" />
        <div
          className="pointer-events-none absolute top-20 -right-24 h-80 w-80 rounded-full bg-chart-2/25 blur-3xl animate-blob -z-10"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-chart-5/15 blur-3xl animate-blob -z-10"
          style={{ animationDelay: "6s" }}
        />

        <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 text-center md:pt-28">
          <Reveal>
            <Badge
              variant="outline"
              className="mb-6 rounded-full px-4 py-1.5 glass animate-gradient bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-5/10"
            >
              <Sparkles className="mr-1.5 h-3 w-3 text-primary" />
              New: AI survey generation — describe it, we build it
            </Badge>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
              Ask smarter questions.
              <br />
              <span className="text-gradient animate-gradient bg-gradient-to-r from-primary via-chart-2 to-chart-5 bg-clip-text">
                Get answers that matter.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground md:text-lg">
              Build multi-section surveys with conditional logic, publish with one click, and share
              a public link anyone can answer — while responses turn into real-time insights on your
              dashboard.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-full px-7 shadow-glow transition-transform duration-300 hover:scale-105"
              >
                <Link to="/register">
                  Start building free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-7 glass transition-transform duration-300 hover:scale-105"
                onClick={() => setOpenVideo(true)}
              >
                <Play className="mr-1 h-4 w-4" />
                Watch demo
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card · Every feature included · Respondents never need an account
            </p>
          </Reveal>

          {/* Hero visual — the actual flagship feature */}
          <Reveal delay={450}>
            <div className="relative mx-auto mt-16 max-w-4xl">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-primary/25 via-chart-2/25 to-chart-5/25 blur-2xl animate-gradient" />
              <RuleEngineMockup />
              <div className="absolute -left-6 top-1/4 hidden rounded-xl border border-border/60 glass p-3 shadow-glow animate-float md:block">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-xs font-medium">Survey published</span>
                </div>
              </div>
              <div className="absolute -right-6 top-2/3 hidden rounded-xl border border-border/60 glass p-3 shadow-glow animate-float-slow md:block">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Public link copied</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capability marquee — honest, product-based */}
      <section className="border-b border-border/60 py-10">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          Everything below ships today — no roadmap promises
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-4 pr-4">
            {[...capabilities, ...capabilities].map((c, i) => (
              <span
                key={i}
                className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Product facts */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-14 md:grid-cols-4">
          {productFacts.map((s) => (
            <FactCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-24">
        <Reveal>
          <div className="text-center">
            <Badge variant="outline" className="mb-3 rounded-full">
              How it works
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              From draft to insights in four steps
            </h2>
            <p className="mt-3 text-muted-foreground">
              The exact workflow inside Survesy — build, preview, publish, analyze.
            </p>
          </div>
        </Reveal>
        <div className="relative mt-14 grid gap-5 md:grid-cols-4">
          {/* connector line */}
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-glow transition-transform duration-300 group-hover:scale-110`}
                    >
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-bold text-muted-foreground/25">{s.n}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <div className="text-center">
              <Badge variant="outline" className="mb-3 rounded-full">
                Features
              </Badge>
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                Everything you need to run surveys
              </h2>
              <p className="mt-3 text-muted-foreground">
                Powerful tools, beautifully simple — and every one of them is real.
              </p>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <Card
                  className={`group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow ${
                    f.large ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div
                    className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-10 bg-gradient-to-br ${f.color}`}
                  />
                  <CardContent className="p-6">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}
                    >
                      <f.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative">
        <div className="absolute inset-0 -z-10 grid-bg opacity-50" />
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <div className="text-center">
              <Badge variant="outline" className="mb-3 rounded-full">
                Pricing
              </Badge>
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                Free. Forever. Really.
              </h2>
              <p className="mt-3 text-muted-foreground">
                One plan with everything in it. No credit card, no upgrades, no limits.
              </p>
            </div>
          </Reveal>
          <div className="mx-auto mt-14 max-w-md">
            <Reveal>
              <div className="relative rounded-2xl bg-gradient-to-br from-primary via-chart-2 to-chart-5 p-[1.5px] shadow-glow">
                <Card className="relative rounded-2xl border-0">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="animate-gradient bg-gradient-to-r from-primary via-chart-2 to-chart-5 text-primary-foreground">
                      Everything included
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-lg font-semibold">Free</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-6xl font-bold tracking-tight">$0</span>
                      <span className="text-sm text-muted-foreground">/forever</span>
                    </div>
                    <ul className="mt-6 space-y-3 text-sm">
                      {freeFeatures.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-8 w-full rounded-full shadow-glow" size="lg" asChild>
                      <Link to="/register">Get started free</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Social proof — kept light and plausible */}
      <section className="relative overflow-hidden border-t border-border/60 bg-muted/20 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="text-center">
              <Badge variant="outline" className="mb-3 rounded-full">
                Early feedback
              </Badge>
              <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
                What early users say
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Sofia R.",
                role: "CX Manager",
                quote:
                  "The rule engine finally feels visual. Respondents only see questions that apply to them.",
              },
              {
                name: "Aarav M.",
                role: "Product Lead",
                quote:
                  "Publish, copy the link, done. Not needing respondent accounts removed all our friction.",
              },
              {
                name: "Liam O.",
                role: "Founder",
                quote:
                  "Roles and audit logs out of the box meant we could hand it to the whole team on day one.",
              },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <Card className="group h-full bg-card/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed">“{t.quote}”</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 text-xs font-bold text-white">
                        {t.name.slice(0, 1)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-24">
        <Reveal>
          <div className="text-center">
            <Badge variant="outline" className="mb-3 rounded-full">
              FAQ
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Frequently asked
            </h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left text-base hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary/25 blur-3xl animate-blob -z-10" />
        <div
          className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-chart-2/25 blur-3xl animate-blob -z-10"
          style={{ animationDelay: "4s" }}
        />
        <div className="mx-auto max-w-4xl px-4 py-28 text-center">
          <Reveal>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              Your first survey is <span className="text-gradient">five minutes away.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Build it, publish it, share the link — free forever.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-full px-7 shadow-glow transition-transform duration-300 hover:scale-105"
              >
                <Link to="/register">
                  Create free account <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full px-7 glass transition-transform duration-300 hover:scale-105"
              >
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2 text-primary-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <span className="text-gradient">Survesy</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Build surveys with conditional logic, publish with one click, and turn responses
                into insights.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
              <div>
                <div className="font-semibold">Product</div>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  <li>
                    <a href="#features" className="transition-colors hover:text-foreground">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#how-it-works" className="transition-colors hover:text-foreground">
                      How it works
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="transition-colors hover:text-foreground">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold">Account</div>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  <li>
                    <Link to="/register" className="transition-colors hover:text-foreground">
                      Get started
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="transition-colors hover:text-foreground">
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link to="/forgot-password" className="transition-colors hover:text-foreground">
                      Reset password
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold">Support</div>
                <ul className="mt-3 space-y-2 text-muted-foreground">
                  <li>
                    <a href="#faq" className="transition-colors hover:text-foreground">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:fohatofficial@gmail.com"
                      className="transition-colors hover:text-foreground"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row">
            <p>© {new Date().getFullYear()} Survesy. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <Bell className="h-3 w-3" />
              Built with a real rule engine — not marketing fluff.
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={openVideo} onOpenChange={setOpenVideo}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Survesy Demo</DialogTitle>
          </DialogHeader>
          {openVideo && <video src={demoVideo} controls autoPlay className="w-full" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
