"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

function ResetPasswordInner() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await authApi.resetPassword({ token, newPassword, confirmPassword });
      setDone(true);
      window.setTimeout(() => router.push("/login"), 1500);
    } catch (caught) {
      const err = caught instanceof ApiError ? caught : null;
      if (err?.code === "TOKEN_EXPIRED") setError("This reset link has expired. Request a new one.");
      else if (err?.code === "TOKEN_ALREADY_USED") setError("This reset link was already used.");
      else setError(err?.message ?? "Unable to reset password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="mt-7 text-xl font-extrabold">Reset password</h1>
      <p className="mt-2 text-[10px] text-slate-soft">Choose a new password for your account.</p>
      {!token && <p className="mt-4 text-[9px] text-red-500">Missing reset token.</p>}
      {done ? (
        <p className="mt-4 text-[9px] font-bold text-green-600">Password updated. Redirecting to login…</p>
      ) : (
        <form onSubmit={submit} className="mt-5 grid gap-3">
          <label className="grid gap-1 text-left text-[9px] font-bold">
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="h-10 rounded border border-line px-3 text-xs"
              required
            />
          </label>
          <label className="grid gap-1 text-left text-[9px] font-bold">
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-10 rounded border border-line px-3 text-xs"
              required
            />
          </label>
          {error && <p className="text-[9px] text-red-500">{error}</p>}
          <Button disabled={busy || !token}>{busy ? "Saving..." : "Update password"}</Button>
        </form>
      )}
      <p className="mt-4 text-[10px]">
        <Link href="/forgot-password" className="font-bold text-green-600">
          Request a new link
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell visual="secure">
      <Suspense fallback={<p className="mt-7 text-[10px]">Loading…</p>}>
        <ResetPasswordInner />
      </Suspense>
    </AuthShell>
  );
}
