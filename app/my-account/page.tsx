"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiBell,
  FiBookOpen,
  FiCheck,
  FiChevronRight,
  FiCreditCard,
  FiDownload,
  FiHeart,
  FiLock,
  FiMail,
  FiMapPin,
  FiMonitor,
  FiMoon,
  FiShield,
  FiTrash2,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import { useWishlist } from "@/app/hooks/useWishlist";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { HoldToConfirm } from "@/components/ui/hold-to-confirm";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { authApi } from "@/lib/api/auth";
import type { ActiveSession } from "@/lib/types/auth";
import { customerApi, type AccountPreferences } from "@/lib/api/customer";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const recommendations = [1, 2, 3, 4, 5, 6].flatMap((id) => {
  const product = PRODUCTS.find((item) => item.id === id);
  return product ? [product] : [];
});
const preferenceRows: {
  icon: IconType;
  title: string;
  detail: string;
  action: string;
  href?: string;
  danger?: boolean;
}[] = [
  {
    icon: FiUser,
    title: "Data & Privacy Settings",
    detail: "Manage your data, download or delete your account.",
    action: "Manage",
  },
  {
    icon: FiBell,
    title: "Marketing Preferences",
    detail: "Control what type of emails and messages you receive.",
    action: "Manage",
  },
  {
    icon: FiDownload,
    title: "Download My Data",
    detail: "Download a copy of your personal data.",
    action: "Download",
  },
  {
    icon: FiTrash2,
    title: "Delete Account",
    detail: "Permanently delete your account and all data.",
    action: "Delete Account",
    danger: true,
  },
];
const accountPreferences: {
  icon: IconType;
  title: string;
  detail: string;
  action: string;
  href: string;
}[] = [
  {
    icon: FiMapPin,
    title: "Default Address",
    detail: "Set your default address for a smooth checkout.",
    action: "Manage Address",
    href: "/my-account/addresses",
  },
  {
    icon: FiCreditCard,
    title: "Default Payment Method",
    detail: "Set your default payment method.",
    action: "Manage Payment",
    href: "/my-account/payment-methods",
  },
  {
    icon: FiMail,
    title: "Email Preferences",
    detail: "Manage emails you receive from TheGrowthHealth.",
    action: "Manage Emails",
    href: "/my-account/notifications",
  },
];
const quickLinks: { label: string; href: string; icon: IconType }[] = [
  { label: "Addresses", href: "/my-account/addresses", icon: FiLock },
  {
    label: "Payment Methods",
    href: "/my-account/payment-methods",
    icon: FiLock,
  },
  {
    label: "Notification Settings",
    href: "/my-account/notifications",
    icon: FiBell,
  },
  { label: "Privacy Policy", href: "/privacy-policy", icon: FiShield },
  { label: "Terms & Conditions", href: "/terms-of-service", icon: FiBookOpen },
];

function SettingRow({
  icon: Icon,
  title,
  detail,
  action,
  href,
  danger,
  onClick,
}: {
  icon: IconType;
  title: string;
  detail: string;
  action: string;
  href?: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className={`flex size-8 items-center justify-center rounded-full ${danger ? "bg-red-50 text-red-500" : "bg-green-soft text-green-600"}`}
      >
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-extrabold">{title}</p>
        <p className="mt-1 truncate text-[8px] text-slate-soft">{detail}</p>
      </div>
      {danger ? (
        <HoldToConfirm
          aria-label={`Hold to confirm ${action}`}
          onConfirm={() => onClick?.()}
          className="hidden min-w-19.5 rounded border border-red-400 px-2 py-1.5 text-[8px] font-bold text-red-500 sm:block"
        >
          Hold to Delete
        </HoldToConfirm>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="hidden min-w-19.5 rounded border border-green-300 px-2 py-1.5 text-[8px] font-bold text-green-600 sm:block"
        >
          {action}
        </button>
      )}
      <FiChevronRight className="text-slate-soft" size={13} />
    </>
  );
  return href ? (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-[#edf0f4] py-3 last:border-0"
    >
      {content}
    </Link>
  ) : (
    <div className="flex items-center gap-3 border-b border-[#edf0f4] py-3 last:border-0">
      {content}
    </div>
  );
}

export default function MyAccountPage() {
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Dark");
  const [twoFactor, setTwoFactor] = useState<boolean | null>(null);
  const [saved, setSaved] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [preferenceError, setPreferenceError] = useState("");
  const [securityOpen, setSecurityOpen] = useState(false);
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [securityBusy, setSecurityBusy] = useState(false);
  const [securityError, setSecurityError] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [twoFactorMode, setTwoFactorMode] = useState<"setup" | "disable" | "regenerate" | "codes" | null>(null);
  const [setupInfo, setSetupInfo] = useState<{ secret: string; qrCodeDataUri: string; backupCodes: string[] } | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpCode, setTotpCode] = useState("");
  const [securityPassword, setSecurityPassword] = useState("");
  const [revokingSession, setRevokingSession] = useState<string | null>(null);
  const preferencesRef = useRef<AccountPreferences>({ language: "English", theme: "Dark" });
  const savedPreferencesRef = useRef<AccountPreferences>({ language: "English", theme: "Dark" });
  const preferencesQueue = useRef<Promise<void>>(Promise.resolve());
  const preferenceRevision = useRef(0);
  const { isWishlisted, toggleWishlist } = useWishlist();
  useEffect(() => {
    let active = true;
    Promise.all([customerApi.accountPreferences(), authApi.me()]).then(([result, auth]) => {
      if (!active) return;
      preferencesRef.current = result.preferences;
      savedPreferencesRef.current = result.preferences;
      setLanguage(result.preferences.language);
      setTheme(result.preferences.theme);
      setTwoFactor(auth.user.twoFactorEnabled);
    }).catch((cause) => {
      if (active) setPreferenceError(cause instanceof Error ? cause.message : "Unable to load your account settings. Sign in and try again.");
    }).finally(() => { if (active) setLoadingPreferences(false); });
    return () => { active = false; };
  }, []);
  const saveAccountPreference = (update: Partial<AccountPreferences>) => {
    const next = { ...preferencesRef.current, ...update };
    preferencesRef.current = next;
    setLanguage(next.language);
    setTheme(next.theme);
    setSaved(false);
    setPreferenceError("");
    setSavingPreferences(true);
    const currentRevision = ++preferenceRevision.current;
    preferencesQueue.current = preferencesQueue.current.catch(() => undefined).then(async () => {
      try {
        const result = await customerApi.updateAccountPreferences(next);
        if (currentRevision === preferenceRevision.current) {
          preferencesRef.current = result.preferences;
          savedPreferencesRef.current = result.preferences;
          setLanguage(result.preferences.language);
          setTheme(result.preferences.theme);
          setSaved(true);
        }
      } catch (cause) {
        if (currentRevision === preferenceRevision.current) {
          preferencesRef.current = savedPreferencesRef.current;
          setLanguage(savedPreferencesRef.current.language);
          setTheme(savedPreferencesRef.current.theme);
          setPreferenceError(cause instanceof Error ? cause.message : "Unable to save your preference.");
        }
        throw cause;
      } finally {
        if (currentRevision === preferenceRevision.current) setSavingPreferences(false);
      }
    }).catch(() => undefined);
  };
  const loadSessions = async (): Promise<boolean> => {
    setLoadingSessions(true);
    setSecurityError("");
    try {
      const result = await authApi.sessions();
      setSessions(result.sessions);
      return true;
    } catch (cause) {
      setSecurityError(cause instanceof Error ? cause.message : "Unable to load active sessions.");
      return false;
    } finally {
      setLoadingSessions(false);
    }
  };
  const openSecurity = () => {
    setSecurityOpen(true);
    setSecurityError("");
    setSecurityMessage("");
    void loadSessions();
  };
  const startTwoFactorSetup = async () => {
    setSecurityBusy(true);
    setSecurityError("");
    setSecurityMessage("");
    try {
      const result = await authApi.setupTwoFactor();
      setSetupInfo(result);
      setBackupCodes([]);
      setTotpCode("");
      setTwoFactorMode("setup");
    } catch (cause) {
      setSecurityError(cause instanceof Error ? cause.message : "Unable to start two-factor setup.");
    } finally {
      setSecurityBusy(false);
    }
  };
  const verifyTwoFactorSetup = async () => {
    setSecurityBusy(true);
    setSecurityError("");
    try {
      await authApi.verifyTwoFactorSetup(totpCode);
      const result = await authApi.me();
      setTwoFactor(result.user.twoFactorEnabled);
      setBackupCodes(setupInfo?.backupCodes ?? []);
      setSetupInfo(null);
      setTotpCode("");
      setTwoFactorMode("codes");
      setSecurityMessage("Two-factor authentication is enabled.");
    } catch (cause) {
      setSecurityError(cause instanceof Error ? cause.message : "Unable to verify the authenticator code.");
    } finally {
      setSecurityBusy(false);
    }
  };
  const disableTwoFactor = async () => {
    setSecurityBusy(true);
    setSecurityError("");
    setSecurityMessage("");
    try {
      await authApi.disableTwoFactor(securityPassword);
      const result = await authApi.me();
      setTwoFactor(result.user.twoFactorEnabled);
      setSecurityPassword("");
      setBackupCodes([]);
      setTwoFactorMode(null);
      setSecurityMessage("Two-factor authentication is disabled.");
    } catch (cause) {
      setSecurityError(cause instanceof Error ? cause.message : "Unable to disable two-factor authentication.");
    } finally {
      setSecurityBusy(false);
    }
  };
  const regenerateBackupCodes = async () => {
    setSecurityBusy(true);
    setSecurityError("");
    setSecurityMessage("");
    try {
      const result = await authApi.regenerateBackupCodes(securityPassword);
      setBackupCodes(result.backupCodes);
      setSecurityPassword("");
      setTwoFactorMode("codes");
      setSecurityMessage("New recovery codes generated. Previous codes no longer work.");
    } catch (cause) {
      setSecurityError(cause instanceof Error ? cause.message : "Unable to generate recovery codes.");
    } finally {
      setSecurityBusy(false);
    }
  };
  const revokeSession = async (session: ActiveSession) => {
    if (session.isCurrent || revokingSession || !window.confirm("Sign out this device?")) return;
    setRevokingSession(session.id);
    setSecurityError("");
    try {
      await authApi.revokeSession(session.id);
      if (await loadSessions()) setSecurityMessage("Session revoked.");
    } catch (cause) {
      setSecurityError(cause instanceof Error ? cause.message : "Unable to revoke this session.");
    } finally {
      setRevokingSession(null);
    }
  };
  const revokeOtherSessions = async () => {
    if (!window.confirm("Sign out all other active sessions?")) return;
    setSecurityBusy(true);
    setSecurityError("");
    try {
      await authApi.revokeOtherSessions();
      if (await loadSessions()) setSecurityMessage("Other sessions revoked.");
    } catch (cause) {
      setSecurityError(cause instanceof Error ? cause.message : "Unable to revoke other sessions.");
    } finally {
      setSecurityBusy(false);
    }
  };
  const closeSecurity = () => {
    if (securityBusy) return;
    setSecurityOpen(false);
    setTwoFactorMode(null);
    setSetupInfo(null);
    setBackupCodes([]);
    setTotpCode("");
    setSecurityPassword("");
    setSecurityError("");
    setSecurityMessage("");
  };

  return (
    <section className="bg-[#fbfcfe] py-7 text-navy">
      <div className="text-[10px] text-slate-soft">
        Home <span className="mx-2">›</span> My Account{" "}
        <span className="mx-2">›</span>{" "}
        <span className="text-navy">Account Settings</span>
      </div>
      <div className="mt-3">
        <h1 className="text-[22px] font-extrabold tracking-tight">
          Account Settings
        </h1>
        <p className="mt-1 text-xs text-slate-soft">
          Manage your account preferences and security settings.
        </p>
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_235px]">
        <main className="min-w-0">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">
              Profile &amp; Preferences
            </h2>
            <p className="mt-1 text-[8px] text-slate-soft">
              Manage your personal preferences and account details.
            </p>
            <div className="mt-3 grid gap-1">
              <label className="flex items-center gap-3 border-b border-[#edf0f4] py-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600">
                  文
                </span>
                <span className="flex-1">
                  <b className="block text-[9px]">Language</b>
                  <small className="text-[8px] text-slate-soft">
                    Choose your preferred language.
                  </small>
                </span>
                <AnimatedSelect
                  value={language}
                  onChange={(event) => {
                    saveAccountPreference({ language: event.target.value as AccountPreferences["language"] });
                  }}
                  disabled={loadingPreferences}
                  size="sm"
                  options={[{ value: "English", label: "English" }, { value: "Hindi", label: "Hindi" }]}
                  className="w-28"
                />
              </label>
              <label className="flex items-center gap-3 border-b border-[#edf0f4] py-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-sm text-green-600">
                  ₹
                </span>
                <span className="flex-1">
                  <b className="block text-[9px]">Currency</b>
                  <small className="text-[8px] text-slate-soft">
                    Currency is set by the store.
                  </small>
                </span>
                <AnimatedSelect
                  value="INR (₹)"
                  disabled
                  size="sm"
                  options={[{ value: "INR (₹)", label: "INR (₹)" }]}
                  className="w-28"
                />
              </label>
              <div className="flex items-center gap-3 py-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600">
                  <FiMoon size={15} />
                </span>
                <span className="flex-1">
                  <b className="block text-[9px]">Theme</b>
                  <small className="text-[8px] text-slate-soft">
                    Choose your preferred theme for the website.
                  </small>
                </span>
                <div className="flex rounded border border-[#dce3eb] p-0.5 text-[8px]">
                  {["Light", "Dark", "System"].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        saveAccountPreference({ theme: value as AccountPreferences["theme"] });
                      }}
                      disabled={loadingPreferences || savingPreferences}
                      className={`rounded px-3 py-1.5 ${theme === value ? "bg-green-600 text-white" : "text-slate-soft"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Password &amp; Security</h2>
            <p className="mt-1 text-[8px] text-slate-soft">
              Keep your account secure.
            </p>
            <div className="mt-2">
              <SettingRow
                icon={FiLock}
                title="Change Password"
                detail="Update your password regularly to keep your account safe."
                action="Change Password"
                onClick={() => alert("Password change flow coming soon.")}
              />
              <div className="flex items-center gap-3 border-b border-[#edf0f4] py-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600">
                  <FiShield size={15} />
                </span>
                <div className="flex-1">
                  <p className="text-[9px] font-extrabold">
                    Two-Factor Authentication (2FA)
                  </p>
                  <p className="mt-1 text-[8px] text-slate-soft">
                    Add an extra layer of security to your account.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={twoFactor === null}
                  onClick={openSecurity}
                  className={`flex items-center gap-1 rounded border px-3 py-1.5 text-[8px] font-bold ${twoFactor ? "border-green-300 text-green-600" : "border-[#bdc8d6] text-slate-soft"}`}
                >
                  <FiCheck /> {twoFactor === null ? "Loading" : twoFactor ? "Enabled" : "Not enabled"}
                </button>
                <FiChevronRight className="text-slate-soft" size={13} />
              </div>
              <SettingRow
                icon={FiMonitor}
                title="Login Activity"
                detail="View and revoke your active sign-in sessions."
                action="View Activity"
                onClick={openSecurity}
              />
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Privacy &amp; Data</h2>
            <p className="mt-1 text-[8px] text-slate-soft">
              Manage your data and privacy preferences.
            </p>
            {preferenceRows.map((row) => (
              <SettingRow
                key={row.title}
                {...row}
                onClick={() =>
                  row.danger
                    ? alert("Account deletion requires confirmation.")
                    : undefined
                }
              />
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Account Preferences</h2>
            <p className="mt-1 text-[8px] text-slate-soft">
              Set your general account preferences.
            </p>
            {accountPreferences.map((row) => (
              <SettingRow key={row.title} {...row} />
            ))}
          </div>
          {loadingPreferences && <p role="status" className="mt-3 text-center text-[9px] text-slate-soft">Loading saved account preferences...</p>}
          {preferenceError && <p role="alert" className="mt-3 text-center text-[9px] font-bold text-red-600">{preferenceError} {preferenceError.includes("Unauthorized") && <Link className="underline" href="/login">Sign in</Link>}</p>}
          {savingPreferences && <p role="status" className="mt-3 text-center text-[9px] text-slate-soft">Saving account preferences...</p>}
          {saved && !savingPreferences && <p role="status" className="mt-3 text-center text-[9px] font-bold text-green-600">Language and theme preferences saved. Theme application remains unchanged.</p>}
        </main>

        <aside className="grid content-start gap-4">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Account Overview</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-green-soft text-green-600">
                <FiUser size={22} />
              </span>
              <div>
                <p className="text-[10px] font-extrabold">Rahul Sharma</p>
                <p className="text-[8px] text-slate-soft">
                  Member since May 2023
                </p>
                <span className="mt-1 inline-block rounded bg-green-soft px-2 py-1 text-[7px] font-bold text-green-600">
                  Premium Member
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-t border-line pt-4 text-[8px]">
              <p className="flex justify-between">
                <span>Total Orders</span>
                <b>24</b>
              </p>
              <p className="flex justify-between">
                <span>Total Spent</span>
                <b>₹18,450</b>
              </p>
              <p className="flex justify-between">
                <span>Reward Points</span>
                <b className="text-amber-500">● 350</b>
              </p>
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded border border-green-500 py-2 text-[8px] font-bold text-green-600"
            >
              View Membership Benefits
            </button>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Security Strength</h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600">
                <FiShield />
              </span>
              <div>
                <b className="block text-[10px] text-green-600">Strong</b>
                <small className="text-[8px] text-slate-soft">
                  Great! Your account is well protected.
                </small>
              </div>
            </div>
            <div className="mt-4 h-1 rounded-full bg-gray-100">
              <div className="h-full w-[82%] rounded-full bg-green-600" />
            </div>
            {[
              "Password is strong",
              twoFactor === null ? "Loading 2FA status" : twoFactor ? "2FA is enabled" : "2FA is not enabled",
              "Recovery email set",
              "Phone number verified",
            ].map((item) => (
              <p key={item} className="mt-3 flex items-center gap-2 text-[8px]">
                <span className="flex size-3 items-center justify-center rounded-full bg-green-600 text-white">
                  <FiCheck size={8} />
                </span>
                {item}
              </p>
            ))}
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Quick Links</h2>
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="mt-3 flex items-center gap-2 text-[8px] font-medium"
              >
                <Icon className="text-slate-soft" size={12} />
                {label}
                <FiChevronRight className="ml-auto" />
              </Link>
            ))}
          </div>
          <div className="rounded-lg bg-[#f3f8fc] p-4">
            <div className="flex items-center gap-2">
              <FiUsers className="text-green-600" />
              <h2 className="text-xs font-extrabold">Need Help?</h2>
            </div>
            <p className="mt-2 text-[8px] text-slate-soft">
              Our support team is here to help you.
            </p>
            <button
              type="button"
              className="mt-3 rounded border border-green-500 px-3 py-1.5 text-[9px] font-bold text-green-600"
            >
              Contact Support
            </button>
          </div>
        </aside>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-extrabold">Recommended for You</h2>
            <p className="mt-1 text-[9px] text-slate-soft">
              Handpicked products you might be interested in
            </p>
          </div>
          <Link href="/shop" className="text-[9px] font-bold text-green-600">
            View All Products <FiArrowRight className="inline" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="relative rounded-md border border-line bg-white p-2 shadow-sm"
            >
              <button
                type="button"
                onClick={() => void toggleWishlist(product.id)}
                aria-label={`Wishlist ${product.name}`}
                className="absolute right-2 top-2 text-slate-soft"
              >
                <FiHeart
                  size={13}
                  fill={isWishlisted(product.id) ? "currentColor" : "none"}
                />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="mx-auto h-20 object-contain"
              />
              <p className="truncate text-[9px] font-bold">{product.name}</p>
              <p className="mt-1 truncate text-[8px] text-slate-soft">
                {product.description}
              </p>
              <p className="mt-1 text-[10px] font-extrabold">
                {money(product.price)}
              </p>
              <p className="text-[8px] text-slate-soft line-through">
                {money(product.mrp ?? 0)}
              </p>
              <AddToCartButton productId={product.id} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold hover:border-green-500 hover:text-green-600" />
            </div>
          ))}
        </div>
      </div>
      {securityOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-navy-900/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSecurity(); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="security-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-line pb-4">
              <div><h2 id="security-title" className="text-base font-extrabold">Account Security</h2><p className="mt-1 text-xs text-slate-soft">Manage authenticator verification and active sessions.</p></div>
              <button type="button" onClick={closeSecurity} disabled={securityBusy} aria-label="Close security settings" className="text-xl text-slate-soft disabled:opacity-50">×</button>
            </header>
            {securityError && <p role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-xs text-red-700">{securityError} {securityError.includes("Unauthorized") && <Link className="font-bold underline" href="/login">Sign in</Link>}</p>}
            {securityMessage && <p role="status" className="mt-4 rounded border border-green-200 bg-green-50 p-3 text-xs text-green-700">{securityMessage}</p>}
            <section className="mt-4 rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h3 className="text-sm font-bold">Two-factor authentication</h3><p className="mt-1 text-xs text-slate-soft">Status: {twoFactor === null ? "Loading..." : twoFactor ? "Enabled" : "Not enabled"}</p></div>
                {twoFactor ? <div className="flex gap-2"><button type="button" disabled={securityBusy} onClick={() => { setSecurityError(""); setSecurityPassword(""); setTwoFactorMode("regenerate"); }} className="rounded border border-line px-3 py-2 text-xs font-bold disabled:opacity-50">Regenerate recovery codes</button><button type="button" disabled={securityBusy} onClick={() => { setSecurityError(""); setSecurityPassword(""); setTwoFactorMode("disable"); }} className="rounded border border-red-200 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50">Disable</button></div> : <button type="button" disabled={securityBusy || twoFactor === null} onClick={() => void startTwoFactorSetup()} className="rounded bg-green-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{securityBusy ? "Starting..." : "Set up authenticator"}</button>}
              </div>
              {twoFactorMode === "setup" && setupInfo && <form className="mt-4 space-y-3 border-t border-line pt-4" onSubmit={(event) => { event.preventDefault(); void verifyTwoFactorSetup(); }}>
                <p className="text-xs text-slate-soft">Scan this QR code with your authenticator app, then enter the current six-digit code to enable 2FA.</p>
                <img src={setupInfo.qrCodeDataUri} alt="Authenticator setup QR code" className="mx-auto size-44 rounded border border-line p-2" />
                <p className="break-all text-center text-xs">Manual setup key: <code className="font-mono font-bold">{setupInfo.secret}</code></p>
                <label className="block text-xs font-bold">Authenticator code<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={totpCode} onChange={(event) => setTotpCode(event.target.value)} className="mt-2 h-10 w-full rounded border border-line px-3 text-sm" /></label>
                <button type="submit" disabled={securityBusy || totpCode.length !== 6} className="rounded bg-green-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{securityBusy ? "Verifying..." : "Verify and enable"}</button>
              </form>}
              {(twoFactorMode === "disable" || twoFactorMode === "regenerate") && <form className="mt-4 space-y-3 border-t border-line pt-4" onSubmit={(event) => { event.preventDefault(); if (twoFactorMode === "disable") void disableTwoFactor(); else void regenerateBackupCodes(); }}>
                <p className="text-xs text-slate-soft">{twoFactorMode === "disable" ? "Confirm your password to disable two-factor authentication." : "Confirm your password to replace your recovery codes. Existing codes will stop working."}</p>
                <label className="block text-xs font-bold">Account password<input required type="password" autoComplete="current-password" value={securityPassword} onChange={(event) => setSecurityPassword(event.target.value)} className="mt-2 h-10 w-full rounded border border-line px-3 text-sm" /></label>
                <button type="submit" disabled={securityBusy || !securityPassword} className="rounded bg-navy-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{securityBusy ? "Verifying..." : twoFactorMode === "disable" ? "Confirm disable" : "Generate new codes"}</button>
              </form>}
              {twoFactorMode === "codes" && <div className="mt-4 border-t border-line pt-4"><p className="text-xs font-bold text-amber-700">Store these recovery codes somewhere safe. They are shown only in this flow.</p><ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">{backupCodes.map((code) => <li key={code} className="rounded bg-slate-50 p-2">{code}</li>)}</ul><button type="button" onClick={() => { setBackupCodes([]); setTwoFactorMode(null); }} className="mt-3 rounded border border-line px-3 py-2 text-xs font-bold">Done</button></div>}
            </section>
            <section className="mt-4 rounded-lg border border-line p-4">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-bold">Active sessions</h3><p className="mt-1 text-xs text-slate-soft">Only sessions returned by the server are shown.</p></div><button type="button" onClick={() => void loadSessions()} disabled={loadingSessions} className="rounded border border-line px-3 py-2 text-xs font-bold disabled:opacity-50">{loadingSessions ? "Refreshing..." : "Refresh"}</button></div>
              {loadingSessions && <p role="status" className="mt-3 text-xs text-slate-soft">Loading active sessions...</p>}
              {!loadingSessions && sessions.length === 0 && !securityError && <p className="mt-3 text-xs text-slate-soft">No active sessions found.</p>}
              <ul className="mt-3 grid gap-2">{sessions.map((session) => <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-line p-3">
                <div className="min-w-0 text-xs"><p className="font-bold">{session.device || "Unknown device"}{session.isCurrent && <span className="ml-2 rounded bg-green-soft px-2 py-0.5 text-[9px] text-green-700">This device</span>}</p><p className="mt-1 text-slate-soft">{session.browser || "Browser not provided"}{session.location ? ` · ${session.location}` : ""}{session.ipAddress ? ` · ${session.ipAddress}` : ""}</p><p className="mt-1 text-slate-soft">Last active {new Date(session.lastActive).toLocaleString()}</p></div>
                {!session.isCurrent && <button type="button" disabled={revokingSession !== null} onClick={() => void revokeSession(session)} className="rounded border border-red-200 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50">{revokingSession === session.id ? "Revoking..." : "Revoke"}</button>}
              </li>)}</ul>
              {sessions.some((session) => !session.isCurrent) && <button type="button" disabled={securityBusy} onClick={() => void revokeOtherSessions()} className="mt-3 rounded border border-red-200 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50">Sign out other sessions</button>}
            </section>
          </section>
        </div>
      )}
    </section>
  );
}
