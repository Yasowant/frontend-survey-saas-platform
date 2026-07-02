import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { resetPassword } from "@/features/auth/api/auth.api";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-6">
        <Card className="w-full max-w-md p-8 text-center">
          <h2 className="text-2xl font-semibold">Invalid link</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This password reset link is missing or malformed. Request a new one below.
          </p>
          <Button className="mt-6 w-full" asChild>
            <Link to="/forgot-password">Request new link</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }
    if (password !== confirm) {
      return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password updated — sign in with your new password");
      navigate({ to: "/login" });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "This reset link is invalid or has expired. Request a new one.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-6">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold">Choose a new password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter and confirm your new password below.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>New password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <Label>Confirm password</Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat the password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
