import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "../components/LoginForm";

export function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary via-primary to-accent p-10 text-primary-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          <span className="text-lg font-semibold">Survesy</span>
        </div>

        <div>
          <h1 className="text-4xl font-semibold leading-tight">
            Build powerful surveys.
            <br />
            Understand your customers.
          </h1>

          <p className="mt-4 max-w-md text-primary-foreground/80">
            Enterprise-grade survey management, response analytics, and team access control — all
            in one place. Completely free.
          </p>
        </div>

        <div className="text-xs text-primary-foreground/70">
          © 2026 Survesy. All rights reserved.
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
