import { apiFetch } from "@/lib/api/client";

export type NotificationPreferences = {
  categories: Record<string, { email: boolean; sms: boolean; push: boolean }>;
  quietHoursEnabled: boolean;
};

export type NutritionGoals = {
  goals: string[];
  activityLevel: string | null;
  workoutType: string | null;
  dietPreference: string | null;
  ageRange: string | null;
  gender: string | null;
  dailyProtein: string | null;
  focusAreas: string[];
};

export type AccountPreferences = { language: "English" | "Hindi"; theme: "Light" | "Dark" | "System" };

export const customerApi = {
  subscribeNewsletter: (email: string) =>
    apiFetch<{ alreadySubscribed: boolean }>("/api/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email, consent: true }),
    }),
  submitContact: (body: { name: string; email: string; phone?: string; subject: string; order?: string; message: string }) =>
    apiFetch<{ submission: { id: string; status: string; createdAt: string } }>("/api/contact-submissions", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  notificationPreferences: () => apiFetch<{ preferences: NotificationPreferences }>("/api/user/notification-preferences"),
  updateNotificationPreferences: (preferences: NotificationPreferences) =>
    apiFetch<{ preferences: NotificationPreferences }>("/api/user/notification-preferences", { method: "PUT", body: JSON.stringify(preferences) }),
  nutritionGoals: () => apiFetch<{ goals: NutritionGoals }>("/api/user/nutrition-goals"),
  updateNutritionGoals: (goals: NutritionGoals) =>
    apiFetch<{ goals: NutritionGoals }>("/api/user/nutrition-goals", { method: "PUT", body: JSON.stringify(goals) }),
  accountPreferences: () => apiFetch<{ preferences: AccountPreferences }>("/api/user/account-preferences"),
  updateAccountPreferences: (preferences: AccountPreferences) =>
    apiFetch<{ preferences: AccountPreferences }>("/api/user/account-preferences", { method: "PUT", body: JSON.stringify(preferences) }),
};
