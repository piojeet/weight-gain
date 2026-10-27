import { apiFetch } from "@/lib/api/client";
import type { ActiveSession, AuthResponse, User } from "@/lib/types/auth";

export type TwoFactorSetupResponse = {
  secret: string;
  qrCodeDataUri: string;
  backupCodes: string[];
};

export const authApi = {
  signup: (body: Record<string, unknown>) =>
    apiFetch<{ user: User }>("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body: Record<string, unknown>) =>
    apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (email: string) =>
    apiFetch<Record<string, never>>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (body: { token: string; newPassword: string; confirmPassword: string }) =>
    apiFetch<Record<string, never>>("/api/auth/reset-password", { method: "POST", body: JSON.stringify(body) }),
  verifyEmail: (token: string) =>
    apiFetch<{ user: { id: string; isEmailVerified: boolean } }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    apiFetch<Record<string, never>>("/api/auth/resend-verification-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  me: () => apiFetch<{ user: User }>("/api/auth/me"),
  setupTwoFactor: () =>
    apiFetch<TwoFactorSetupResponse>("/api/auth/2fa/setup", { method: "POST" }),
  verifyTwoFactorSetup: (totpCode: string) =>
    apiFetch<{ twoFactorEnabled: boolean }>("/api/auth/2fa/verify-setup", {
      method: "POST",
      body: JSON.stringify({ totpCode }),
    }),
  disableTwoFactor: (password: string) =>
    apiFetch<Record<string, never>>("/api/auth/2fa/disable", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  regenerateBackupCodes: (password: string) =>
    apiFetch<{ backupCodes: string[] }>("/api/auth/2fa/backup-codes/regenerate", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  sessions: () => apiFetch<{ sessions: ActiveSession[] }>("/api/auth/sessions"),
  revokeSession: (id: string) =>
    apiFetch<Record<string, never>>(`/api/auth/sessions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  revokeOtherSessions: () =>
    apiFetch<Record<string, never>>("/api/auth/sessions", { method: "DELETE" }),
  logout: () => apiFetch<Record<string, never>>("/api/auth/logout", { method: "POST" }),
  changePassword: (body: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    apiFetch<Record<string, never>>("/api/auth/change-password", { method: "PUT", body: JSON.stringify(body) }),
  updateProfile: (body: Record<string, unknown>) =>
    apiFetch<{ user: User }>("/api/user/profile", { method: "PUT", body: JSON.stringify(body) }),
  uploadAvatar: (file: File) => {
    const body = new FormData();
    body.append("file", file);
    return apiFetch<{ avatarUrl: string }>("/api/user/profile/avatar", { method: "POST", body });
  },
  checkAvailability: (query: { email?: string; phone?: string }) => {
    const params = new URLSearchParams();
    if (query.email) params.set("email", query.email);
    if (query.phone) params.set("phone", query.phone);
    return apiFetch<{ available: boolean }>(`/api/auth/check-availability?${params.toString()}`);
  },
};
