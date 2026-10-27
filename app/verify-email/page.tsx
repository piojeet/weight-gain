"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

function VerifyEmailInner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const presetEmail = params.get("email") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "expired" | "invalid" | "idle">("idle");
  const [email, setEmail] = useState(presetEmail);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus(presetEmail ? "idle" : "invalid");
      return;
    }
    setStatus("loading");
    authApi
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((caught) => {
        const err = caught instanceof ApiError ? caught : null;
        setStatus(err?.code === "TOKEN_EXPIRED" ? "expired" : "invalid");
      });
  }, [token, presetEmail]);

  const resend = async () => {
    if (!email) return;
    await authApi.resendVerification(email);
    setInfo("If an unverified account exists for this email, a new verification link has been sent.");
  };

  return (
    <>
      <h1 className="mt-7 text-xl font-extrabold">Verify your email</h1>
      {status === "loading" && <p className="mt-4 text-[10px]">Confirming your email…</p>}
      {status === "success" && (
        <p className="mt-4 text-[10px] font-bold text-green-600">
          Email verified. You can now{" "}
          <Link href="/login" className="underline">
            log in
          </Link>
          .
        </p>
      )}
      {(status === "expired" || status === "invalid" || status === "idle") && (
        <div className="mt-4 grid gap-3">
          {status === "expired" && <p className="text-[10px] text-red-500">This verification link has expired.</p>}
          {status === "invalid" && token && <p className="text-[10px] text-red-500">This verification link is invalid.</p>}
          {!token && <p className="text-[10px] text-slate-soft">Enter your email to receive a verification link.</p>}
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="h-10 rounded border border-line px-3 text-xs"
          />
          <Button type="button" onClick={resend}>
            Resend verification email
          </Button>
          {info && <p className="text-[9px] font-bold text-green-600">{info}</p>}
        </div>
      )}
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <Suspense fallback={<p className="mt-7 text-[10px]">Loading…</p>}>
        <VerifyEmailInner />
      </Suspense>
    </AuthShell>
  );
}
