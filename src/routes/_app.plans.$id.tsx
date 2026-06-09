import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { plansRepo } from "@/lib/storage";

export const Route = createFileRoute("/_app/plans/$id")({ component: PlanDetails });

function PlanDetails() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const plan = plansRepo.get(id);

  if (!plan) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate({ to: "/plans" })}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
        <Card><CardContent className="py-10 text-center text-muted-foreground">Plan not found.</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm"><Link to="/plans"><ArrowLeft className="mr-2 h-4 w-4" />All plans</Link></Button>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /><h1 className="text-2xl font-semibold">{plan.name}</h1></div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.duration === "monthly" ? "month" : "year"}</span>
              </div>
            </div>
            <Badge variant={plan.status === "active" ? "default" : "secondary"}>{plan.status}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Features</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</li>
              ))}
              {plan.features.length === 0 && <p className="text-sm text-muted-foreground">No features listed.</p>}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Limits</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Row label="Surveys" value={plan.limits.surveys.toLocaleString()} />
            <Separator />
            <Row label="Responses / period" value={plan.limits.responses.toLocaleString()} />
            <Separator />
            <Row label="Users" value={plan.limits.users.toLocaleString()} />
            <Separator />
            <Row label="Duration" value={plan.duration === "monthly" ? "Monthly" : "Yearly"} />
            <Separator />
            <Row label="Created" value={new Date(plan.createdAt).toLocaleDateString()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
