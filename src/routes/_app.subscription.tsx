import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { getSurveys } from "@/features/surveys/api/survey.api";
import { getResponses } from "@/features/surveys/api/response.api";

export const Route = createFileRoute("/_app/subscription")({ component: PlanPage });

const FEATURES = [
  "Unlimited surveys",
  "Unlimited responses",
  "Unlimited sections & questions",
  "Conditional logic rules",
  "Full analytics & dashboards",
  "User, role & permission management",
  "Audit logs",
  "Email notifications",
];

function PlanPage() {
  const { data: surveysRes } = useQuery({ queryKey: ["surveys"], queryFn: getSurveys });
  const { data: responsesRes } = useQuery({ queryKey: ["responses"], queryFn: getResponses });

  const surveyCount = surveysRes?.data?.length ?? 0;
  const responseCount = responsesRes?.data?.length ?? 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Your plan</h1>
        <p className="text-sm text-muted-foreground">
          This platform is completely free — every feature is included.
        </p>
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Free plan</CardTitle>
            <Badge>Active</Badge>
          </div>
          <CardDescription>
            No payments, no limits, no upgrades needed. Everything is unlocked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" /> {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Surveys created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{surveyCount}</div>
            <p className="text-sm text-muted-foreground">of unlimited</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Responses collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{responseCount}</div>
            <p className="text-sm text-muted-foreground">of unlimited</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
