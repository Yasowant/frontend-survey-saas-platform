import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold">Reset password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we'll send a reset link.
        </p>
        {sent ? (
          <div className="mt-6 rounded-md border bg-success/10 p-4 text-sm">
            Reset link sent to <b>{email}</b>. Check your inbox.
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); if (!email) return toast.error("Enter email"); setSent(true); toast.success("Reset link sent"); }}
            className="mt-6 space-y-4"
          >
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </Card>
    </div>
  );
}
