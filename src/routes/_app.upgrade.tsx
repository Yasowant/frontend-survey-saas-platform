import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Sparkles } from "lucide-react";
import { subRepo, invoicesRepo, notifRepo, auditRepo, uid } from "@/lib/storage";
import type { PlanId } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/upgrade")({ component: Upgrade });

const PLANS = [
  { id: "free" as PlanId, name: "Free", price: 0, features: ["1 Survey", "100 Responses", "Basic analytics", "Email support"] },
  { id: "basic" as PlanId, name: "Basic", price: 29, features: ["10 Surveys", "10,000 Responses", "Advanced analytics", "Priority support", "Export to CSV/PDF"], highlight: true },
  { id: "premium" as PlanId, name: "Premium", price: 99, features: ["Unlimited Surveys", "Unlimited Responses", "Custom branding", "API access", "Dedicated manager"] },
];

function Upgrade() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<PlanId>("free");
  const [target, setTarget] = useState<PlanId | null>(null);
  const [method, setMethod] = useState("Credit Card");
  const [processing, setProcessing] = useState(false);

  useEffect(() => setCurrent(subRepo.get().planId), []);

  const pay = () => {
    if (!target) return;
    setProcessing(true);
    setTimeout(() => {
      const plan = PLANS.find((p) => p.id === target)!;
      subRepo.set({ planId: target, startedAt: new Date().toISOString(), renewsAt: new Date(Date.now() + 30 * 86400000).toISOString() });
      invoicesRepo.add({
        id: uid(), number: `INV-${String(Math.floor(Math.random() * 90000) + 10000)}`,
        date: new Date().toISOString(), amount: plan.price, status: "paid", plan: target, method,
      });
      const n = notifRepo.list();
      n.unshift({ id: uid(), type: "payment_success", title: "Payment success", message: `Upgraded to ${plan.name} plan`, read: false, createdAt: new Date().toISOString() });
      notifRepo.set(n);
      auditRepo.add({ user: "demo@user.com", action: `Upgraded to ${plan.name}`, module: "Billing" });
      setProcessing(false);
      setTarget(null);
      setCurrent(target);
      toast.success(`Payment successful — welcome to ${plan.name}!`);
      navigate({ to: "/billing" });
    }, 1200);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Choose your plan</h1>
        <p className="text-sm text-muted-foreground">Upgrade or downgrade anytime</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = p.id === current;
          return (
            <Card key={p.id} className={p.highlight ? "border-primary ring-2 ring-primary/20" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">{p.name} {p.highlight && <Sparkles className="h-4 w-4 text-primary" />}</CardTitle>
                  {isCurrent && <Badge variant="outline">Current</Badge>}
                </div>
                <CardDescription>
                  <span className="text-3xl font-semibold text-foreground">${p.price}</span><span className="text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-success" /> {f}</li>
                  ))}
                </ul>
                <Button className="w-full" disabled={isCurrent} variant={p.highlight ? "default" : "outline"} onClick={() => setTarget(p.id)}>
                  {isCurrent ? "Current plan" : `Upgrade to ${p.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!target} onOpenChange={() => setTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Complete payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Payment method</Label>
              <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-2 gap-2">
                {["UPI", "Credit Card", "Debit Card", "Net Banking"].map((m) => (
                  <label key={m} className="flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm hover:bg-muted/40">
                    <RadioGroupItem value={m} /> {m}
                  </label>
                ))}
              </RadioGroup>
            </div>
            {method.includes("Card") && (
              <div className="space-y-3">
                <div className="space-y-1"><Label>Card number</Label><Input placeholder="4242 4242 4242 4242" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Expiry</Label><Input placeholder="MM/YY" /></div>
                  <div className="space-y-1"><Label>CVV</Label><Input placeholder="123" /></div>
                </div>
              </div>
            )}
            {method === "UPI" && <div className="space-y-1"><Label>UPI ID</Label><Input placeholder="you@bank" /></div>}
            <Button className="w-full" onClick={pay} disabled={processing}>
              {processing ? "Processing…" : `Pay $${PLANS.find((p) => p.id === target)?.price}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
