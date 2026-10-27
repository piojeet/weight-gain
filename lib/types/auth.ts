export type ApiErrorBody = {
  code: string;
  details: string[];
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  error: ApiErrorBody | null;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: "customer" | "admin" | string;
  adminRole: string | null;
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  status?: string;
  pendingEmail?: string | null;
  membershipTier?: string | null;
  totalOrders?: number;
  totalSpent?: number;
  avatarUrl?: string | null;
};

export type SessionInfo = {
  id: string;
  expiresAt: string;
};

export type AuthResponse = {
  user: User;
  csrfToken: string;
  session: SessionInfo;
  requiresTwoFactorSetup?: boolean;
};

export type ActiveSession = {
  id: string;
  device: string | null;
  browser: string | null;
  ipAddress: string | null;
  location: string | null;
  lastActive: string;
  isCurrent: boolean;
};
