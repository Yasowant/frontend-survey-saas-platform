import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
});
