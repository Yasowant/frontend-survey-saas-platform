import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import demoVideo from "@/assets/videos/survesy-demo.mp4";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Layers,
  Star,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
  Users,
  TrendingUp,
  Globe,
  Play,
  PenLine,
  Send,
  LineChart,
  GraduationCap,
  Building2,
  ShoppingBag,
  HeartPulse,
  Briefcase,
  Megaphone,
  Moon,
  Sun,
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
          "Free enterprise survey platform with powerful analytics and conditional logic.",
      },
      { property: "og:title", content: "Survesy — Build Surveys, Grow Insights" },
      {
        property: "og:description",
        content: "Beautiful surveys. Real-time analytics. Built for modern teams.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Layers,
    title: "Multi-section surveys",
    desc: "Organize questions into clear sections, each with their own focus.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Workflow,
    title: "Conditional logic",
    desc: "Show or hide questions based on previous answers with the rules engine.",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Real-time analytics",
    desc: "Track responses, completion rates, and trends with rich dashboards.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: ShieldCheck,
    title: "Audit & permissions",
    desc: "Role-based access and full audit logs for enterprise compliance.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "10 question types",
    desc: "Text, rating, dropdown, file upload, date, and more out of the box.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "Free forever",
    desc: "Every feature included at no cost. No upgrades, no hidden fees.",
    color: "from-rose-500 to-red-500",
  },
];

const freeFeatures = [
  "Unlimited surveys",
  "Unlimited responses",
  "Conditional logic rules",
  "Analytics dashboard",
  "User, role & permission management",
  "Email notifications",
];

const logos = [
  "ACME",
  "NORTHWIND",
  "STRIPE-LIKE",
  "PIXELFORGE",
  "LUMEN",
  "ORBITAL",
  "VANTAGE",
  "NEXUS",
];

const stats = [
  { value: 12000, suffix: "+", label: "Surveys created" },
  { value: 2400000, suffix: "+", label: "Responses collected" },
  { value: 98, suffix: "%", label: "Customer satisfaction" },
  { value: 120, suffix: "+", label: "Countries served" },
];

const workflowSteps = [
  {
    title: "Create Survey",
    description: "Build surveys with drag-and-drop questions and smart templates.",
    icon: PenLine,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Share Anywhere",
    description: "Send links, embed forms, or distribute through email campaigns.",
    icon: Send,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Track Responses",
    description: "Watch responses arrive in real-time dashboards.",
    icon: Users,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Generate Insights",
    description: "Turn raw data into reports and actionable decisions.",
    icon: LineChart,
    color: "from-orange-500 to-rose-500",
  },
];

const testimonials = [
  {
    name: "Sofia Rossi",
    role: "CX Manager",
    quote: "Conditional logic finally feels visual. Our completion rate jumped to 92%.",
  },
  {
    name: "Aarav Mehta",
    role: "Product Lead",
    quote: "Survesy made our research workflow 3x faster. The analytics are gorgeous.",
  },
  {
    name: "Liam O'Connor",
    role: "Founder",
    quote: "Beautiful out of the box. Customers actually enjoy filling surveys.",
  },
  {
    name: "Emma Wilson",
    role: "Marketing Head",
    quote: "We replaced three tools with Survesy and saved hours every week.",
  },
];

function useCountUp(target: number, start: boolean, duration = 1500) {
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

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, seen } = useInView<HTMLDivElement>();
  const n = useCountUp(value, seen);
  const display =
    n >= 1000
      ? `${(n / 1000).toFixed(n >= 1_000_000 ? 1 : 0)}${n >= 1_000_000 ? "M" : "k"}`
      : `${n}`;
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold md:text-4xl text-gradient">
        {display}
        {suffix}
      </div>
      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function Landing() {
  const [openVideo, setOpenVideo] = useState(false);
  const [theme, setThemeState] = useState<Theme>(() => getTheme());
  const [showWorkflow, setShowWorkflow] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 glass">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-2 text-primary-foreground shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-6">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-gradient">Survesy</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="story-link hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="story-link hover:text-foreground">
              Pricing
            </a>
            <a href="#faq" className="story-link hover:text-foreground">
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
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="shadow-glow">
              <Link to="/register">
                Get started <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60 min-h-screen">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="absolute inset-0 -z-10 grid-bg" />
        {/* floating blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-blob -z-10" />
        <div
          className="pointer-events-none absolute top-20 -right-24 h-80 w-80 rounded-full bg-chart-2/30 blur-3xl animate-blob -z-10"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-chart-5/20 blur-3xl animate-blob -z-10"
          style={{ animationDelay: "6s" }}
        />

        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:py-32">
          <Reveal>
            <Badge
              variant="outline"
              className="mb-5 glass animate-gradient bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-5/10"
            >
              <Sparkles className="mr-1 h-3 w-3 text-primary" /> The all-in-one survey platform
            </Badge>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
              Create surveys, collect answers,
              <br />
              <span className="text-gradient animate-gradient bg-gradient-to-r from-primary via-chart-2 to-chart-5 bg-clip-text">
                see insights instantly.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              Survesy helps you build beautiful online forms in minutes, share them with a link, and
              watch responses turn into clear charts and reports — no spreadsheets, no setup.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2 text-xs">
              {[
                "📝 Build in minutes",
                "🔗 Share with a link",
                "📊 Live analytics",
                "🔒 Secure & private",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="shadow-glow hover-scale">
                <Link to="/register">
                  Start free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass hover-scale"
                onClick={() => setOpenVideo(true)}
              >
                <Play className="mr-1 h-4 w-4" />
                Live Demo
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              No credit card required · Free forever plan · Setup in 60 seconds
            </p>
          </Reveal>

          {/* Hero visual */}
          <Reveal delay={450}>
            <div className="relative mx-auto mt-14 max-w-4xl">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-primary/30 via-chart-2/30 to-chart-5/30 blur-2xl animate-gradient" />
              <div className="relative overflow-hidden rounded-2xl border border-border/60 glass shadow-glow">
                <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-3">
                  <div className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-success/70" />
                  <div className="ml-3 text-xs text-muted-foreground">survesy.app/dashboard</div>
                </div>
                <div className="grid grid-cols-3 gap-3 p-5 text-left">
                  {[
                    { icon: Users, label: "Responses", value: "12,480", trend: "+18%" },
                    { icon: TrendingUp, label: "Completion", value: "92%", trend: "+4%" },
                    { icon: Globe, label: "Countries", value: "47", trend: "+3" },
                  ].map((s, i) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-border/60 bg-card p-3 reveal-up"
                      style={{ animationDelay: `${600 + i * 120}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <s.icon className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-medium text-success">{s.trend}</span>
                      </div>
                      <div className="mt-2 text-lg font-semibold">{s.value}</div>
                      <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                  <div className="col-span-3 rounded-xl border border-border/60 bg-card p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium">Response trend</span>
                      <span className="text-[10px] text-muted-foreground">Last 7 days</span>
                    </div>
                    <div className="flex h-24 items-end gap-1.5">
                      {[40, 65, 50, 80, 60, 90, 75, 95, 70, 88, 100, 82].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary animate-float"
                          style={{
                            height: `${h}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${3 + (i % 3)}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* floating cards */}
              <div className="absolute -left-6 top-1/3 hidden rounded-xl border border-border/60 glass p-3 shadow-glow animate-float md:block">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-xs font-medium">New response</span>
                </div>
              </div>
              <div className="absolute -right-6 top-2/3 hidden rounded-xl border border-border/60 glass p-3 shadow-glow animate-float-slow md:block">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-warning text-warning" />
                  ))}
                </div>
                <div className="mt-1 text-[10px] text-muted-foreground">4.9 average rating</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Logo marquee */}
      <section className="border-b border-border/60 py-10">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          Trusted by teams worldwide
        </p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-12 pr-12">
            {[...logos, ...logos].map((l, i) => (
              <span
                key={i}
                className="text-lg font-semibold tracking-widest text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* How it works — 3 simple steps */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <div className="text-center">
            <Badge variant="outline" className="mb-3">
              How it works
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              From idea to insights in 3 steps
            </h2>
            <p className="mt-3 text-muted-foreground">
              No training needed. If you can write a question, you can build a survey.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: PenLine,
              title: "Build your survey",
              desc: "Drag in questions, organize them into sections, and customize the look — all without code.",
              color: "from-primary to-chart-2",
            },
            {
              n: "02",
              icon: Send,
              title: "Share with anyone",
              desc: "Send a public link, embed it on your site, or email it. Works on every device.",
              color: "from-chart-2 to-chart-5",
            },
            {
              n: "03",
              icon: LineChart,
              title: "Analyze in real time",
              desc: "Watch responses flow in. Get instant charts, completion rates, and exportable reports.",
              color: "from-chart-5 to-primary",
            },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-glow transition-transform group-hover:scale-110`}
                    >
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-bold text-muted-foreground/30">{s.n}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Who is it for */}
      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <div className="text-center">
              <Badge variant="outline" className="mb-3">
                Built for everyone
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Who uses Survesy?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Anyone who needs answers — from a quick poll to enterprise research.
              </p>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: Building2, label: "Businesses" },
              { icon: GraduationCap, label: "Educators" },
              { icon: ShoppingBag, label: "E-commerce" },
              { icon: HeartPulse, label: "Healthcare" },
              { icon: Briefcase, label: "HR Teams" },
              { icon: Megaphone, label: "Marketers" },
            ].map((u, i) => (
              <Reveal key={u.label} delay={i * 60}>
                <div className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
                  <u.icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                  <span className="text-sm font-medium">{u.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <Reveal>
          <div className="text-center">
            <Badge variant="outline" className="mb-3">
              Features
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Everything you need to run surveys
            </h2>
            <p className="mt-3 text-muted-foreground">Powerful tools, beautifully simple.</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
                <div
                  className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-10 bg-gradient-to-br ${f.color}`}
                />
                <CardContent className="p-6">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-14">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="text-center">
            <Badge variant="outline">Workflow</Badge>

            <h2 className="mt-3 text-3xl font-semibold md:text-4xl">How Survesy Works</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              From survey creation to actionable insights.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <Card
                key={step.title}
                className="group relative overflow-hidden border-border/50 bg-background/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
              >
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 bg-gradient-to-br ${step.color}`}
                />

                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${step.color} text-white`}
                    >
                      <step.icon className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Step {index + 1}
                      </div>
                      <h3 className="text-sm font-semibold">{step.title}</h3>
                    </div>
                  </div>

                  {showWorkflow && (
                    <p className="mt-3 text-sm text-muted-foreground">{step.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWorkflow((v) => !v)}
            >
              {showWorkflow ? "Show less" : "Read more"}
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative border-t border-border/60 bg-muted/30">
        <div className="absolute inset-0 -z-10 grid-bg opacity-50" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="text-center">
              <Badge variant="outline" className="mb-3">
                Pricing
              </Badge>
              <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                Free. Forever.
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every feature included. No credit card, no upgrades, no limits.
              </p>
            </div>
          </Reveal>
          <div className="mx-auto mt-12 max-w-md">
            <Reveal>
              <Card className="relative border-primary shadow-glow">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="animate-gradient bg-gradient-to-r from-primary via-chart-2 to-chart-5 text-primary-foreground">
                    Everything included
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">Free</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-sm text-muted-foreground">/forever</span>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm">
                    {freeFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full shadow-glow" asChild>
                    <Link to="/register">Get started free</Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/5 to-background" />

        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                Trusted Worldwide
              </Badge>

              <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
                Loved by thousands of teams
              </h2>

              <p className="mt-4 text-muted-foreground">
                From startups to enterprises, teams trust Survesy to collect meaningful feedback and
                make smarter decisions.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.7fr_1fr]">
            {/* Featured Testimonial */}
            <Reveal>
              <Card className="relative overflow-hidden border-primary/20 bg-card/70 backdrop-blur-xl shadow-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10" />

                <CardContent className="relative p-10">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>

                  <h3 className="mt-6 text-3xl font-semibold leading-tight">
                    “Survesy completely transformed our customer feedback workflow.”
                  </h3>

                  <p className="mt-4 text-lg text-muted-foreground">
                    We increased survey completion rates by 92% and reduced reporting time from
                    hours to minutes. The analytics dashboard alone saved our team countless hours
                    every month.
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 text-lg font-bold text-white">
                      SR
                    </div>

                    <div>
                      <div className="font-semibold">Sofia Rossi</div>
                      <div className="text-sm text-muted-foreground">CX Manager · Orbital</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            {/* Side Reviews */}
            <div className="space-y-4">
              {[
                {
                  name: "Aarav",
                  text: "Analytics are incredible and easy to understand.",
                },
                {
                  name: "Liam",
                  text: "Setup took less than 5 minutes.",
                },
                {
                  name: "Sarah",
                  text: "The best survey builder we've used so far.",
                },
              ].map((review, index) => (
                <Reveal key={review.name} delay={index * 100}>
                  <Card
                    className="group bg-card/70 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-glow"
                    style={{
                      transform: `rotate(${index % 2 === 0 ? "-1deg" : "1deg"})`,
                    }}
                  >
                    <CardContent className="p-5">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>

                      <p className="mt-3 text-sm">"{review.text}"</p>

                      <p className="mt-4 text-xs text-muted-foreground">— {review.name}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
        <Reveal>
          <h2 className="text-center text-3xl font-semibold tracking-tight md:text-5xl">
            Frequently asked
          </h2>
        </Reveal>
        <div className="mt-10 space-y-4">
          {[
            {
              q: "Do I need a credit card to start?",
              a: "No. The Free plan is free forever and requires no payment details.",
            },
            {
              q: "Can I export my responses?",
              a: "Yes. Export to CSV or JSON from the responses dashboard at any time.",
            },
            {
              q: "How does conditional logic work?",
              a: "Create rules that show or hide questions based on prior answers using our visual rules engine.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Absolutely. Cancel from the billing page and keep access until the end of the period.",
            },
          ].map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <Card className="transition hover:border-primary/40 hover:shadow-md">
                <CardContent className="p-5">
                  <h3 className="font-medium">{item.q}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border/60 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="pointer-events-none absolute top-0 left-1/4 h-64 w-64 rounded-full bg-primary/30 blur-3xl animate-blob -z-10" />
        <div
          className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-chart-2/30 blur-3xl animate-blob -z-10"
          style={{ animationDelay: "4s" }}
        />
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Ready to collect <span className="text-gradient">better insights?</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Join thousands of teams already using Survesy.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="shadow-glow hover-scale">
                <Link to="/register">
                  Create free account <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="glass hover-scale">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Survesy. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="story-link hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="story-link hover:text-foreground">
              Terms
            </a>
            <a href="#" className="story-link hover:text-foreground">
              Contact
            </a>
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
