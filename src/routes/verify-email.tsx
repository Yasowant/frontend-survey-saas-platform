import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-email")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: VerifyEmailPage,
});
