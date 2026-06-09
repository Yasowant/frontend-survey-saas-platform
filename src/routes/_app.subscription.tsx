import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { subRepo, responsesRepo, surveysRepo } from "@/lib/storage";
import type { Subscription } from "@/lib/types";

export const Route = createFileRoute("/_app/subscription")({ component: Sub });

const PLANS = {
  free: { name: "Free", price: 0, surveys: 1, responses: 100 },
  basic: { name: "Basic", price: 29, surveys: 10, responses: 10000 },
  premium: { name: "Premium", price: 99, surveys: Infinity, responses: Infinity },
};

function Sub() {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [used, setUsed] = useState({ surveys: 0, responses: 0 });
  useEffect(() => {
    setSub(subRepo.get());
    setUsed({ surveys: surveysRepo.list().length, responses: responsesRepo.list().length });
  }, []);
  if (!sub) return null;
  const plan = PLANS[sub.planId];
  const sPct = plan.surveys === Infinity ? 100 : Math.min(100, (used.surveys / plan.surveys) * 100);
  const rPct = plan.responses === Infinity ? 100 : Math.min(100, (used.responses / plan.responses) * 100);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Current plan</h1>
        <p className="text-sm text-muted-foreground">Your subscription and usage</p>
      </div>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/30">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge>{plan.name} Plan</Badge>
              <div className="mt-2 text-3xl font-semibold">${plan.price}<span className="text-base text-muted-foreground">/mo</span></div>
              <div className="mt-1 text-sm text-muted-foreground">Renews on {new Date(sub.renewsAt).toLocaleDateString()}</div>
            </div>
            <Button asChild><Link to="/upgrade">Upgrade plan</Link></Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Surveys used</CardTitle><CardDescription>{used.surveys} of {plan.surveys === Infinity ? "Unlimited" : plan.surveys}</CardDescription></CardHeader>
          <CardContent><Progress value={sPct} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Responses collected</CardTitle><CardDescription>{used.responses.toLocaleString()} of {plan.responses === Infinity ? "Unlimited" : plan.responses.toLocaleString()}</CardDescription></CardHeader>
          <CardContent><Progress value={rPct} /></CardContent>
        </Card>
      </div>
    </div>
  );
}
