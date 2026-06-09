import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useSearch } from "@tanstack/react-router";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

export function VerifyEmailPage() {
  const { token } = useSearch({
    from: "/verify-email",
  });

  const { mutate, isPending, isSuccess, isError, error } = useVerifyEmail();
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    if (!token) return;

    mutate(token, {
      onSuccess: (response: any) => {
        if (response?.data?.alreadyVerified) {
          setAlreadyVerified(true);
        }
      },
    });
  }, [token, mutate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Background Blurs */}

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* Card */}

      <Card className="relative z-10 w-full max-w-lg border-white/10 bg-background/70 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-10">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}

            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Survesy</h1>

              <p className="text-sm text-muted-foreground">Intelligent survey platform</p>
            </div>

            {/* Loading */}

            {isPending && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>

                <h2 className="text-2xl font-bold">Verifying your email</h2>

                <p className="mt-3 text-muted-foreground">
                  Please wait while we confirm your account.
                </p>
              </>
            )}

            {/* Success */}

            {isSuccess && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>

                <h2 className="text-3xl font-bold text-green-500">
                  {alreadyVerified ? "Email Already Verified" : "Email Verified"}
                </h2>

                <p className="mt-3 max-w-sm text-muted-foreground">
                  {alreadyVerified
                    ? "Your email has already been verified. Please sign in to continue."
                    : "Your account has been successfully verified. You can now create surveys, collect responses, and unlock insights."}
                </p>

                <div className="mt-8 flex gap-3">
                  <Button asChild>
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button variant="outline" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                </div>
              </>
            )}

            {/* Error */}

            {isError && (
              <>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>

                <h2 className="text-3xl font-bold text-red-500">Verification Failed</h2>

                <p className="mt-3 max-w-sm text-muted-foreground">
                  {(error as any)?.response?.data?.message ||
                    "This verification link is invalid or has expired."}
                </p>

                <div className="mt-8">
                  <Button asChild>
                    <Link to="/login">Back to Sign In</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
