"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { IconType } from "react-icons";
import {
  FiBell,
  FiCamera,
  FiCheck,
  FiChevronRight,
  FiCreditCard,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiMapPin,
  FiSave,
  FiShield,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { AnimatedSwitch } from "@/components/ui/animated-switch";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const quickLinks: Array<{ label: string; href: string; icon: IconType }> = [
  { label: "Manage Addresses", href: "/my-account/addresses", icon: FiMapPin },
  { label: "Payment Methods", href: "/my-account/payment-methods", icon: FiCreditCard },
  { label: "Notification Settings", href: "/my-account/notifications", icon: FiBell },
  { label: "Change Password", href: "/my-account", icon: FiLock },
  { label: "Delete Account", href: "/my-account", icon: FiTrash2 },
];

const initialProfile = {
  fullName: "Rahul Sharma",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  dob: "1997-08-15",
  gender: "Male",
};

function Field({
  label,
  value,
  onChange,
  type = "text",
  verified = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  verified?: boolean;
}) {
  return (
    <label className="grid gap-1 text-[9px] font-bold text-navy">
      {label}
      <span className="relative">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full rounded border border-line bg-white px-2.5 text-[9px] font-normal text-navy outline-none transition focus:border-green-500"
        />
        {verified && (
          <span className="absolute right-2 top-2 rounded bg-green-soft px-1.5 py-0.5 text-[8px] font-bold text-green-600">
            Verified
          </span>
        )}
      </span>
    </label>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="grid gap-1 text-[9px] font-bold text-navy">
      {label}
      <span className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={label}
          className="h-9 w-full rounded border border-line bg-white px-2.5 pr-9 text-[9px] font-normal text-navy outline-none transition focus:border-green-500"
        />
        <button
          type="button"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2.5 top-2.5 text-slate-soft"
        >
          {visible ? <FiEyeOff size={13} /> : <FiEye size={13} />}
        </button>
      </span>
    </label>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-[#f9fbfd] p-3">
      <div className="min-w-0">
        <p className="text-[9px] font-extrabold text-navy">{label}</p>
        <p className="mt-1 text-[8px] text-slate-soft">{description}</p>
      </div>
      <AnimatedSwitch
        aria-label={`Toggle ${label}`}
        checked={enabled}
        onCheckedChange={onToggle}
      />
    </div>
  );
}

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState(initialProfile);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [avatar, setAvatar] = useState("/trusted-users/user1.jpg");
  const [saved, setSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Profile updated successfully.");
  const [verified, setVerified] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    authApi
      .me()
      .then(({ user }) => {
        setProfile((current) => ({
          ...current,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone ?? "",
        }));
        if (user.avatarUrl) setAvatar(user.avatarUrl);
        setVerified(user.isEmailVerified);
        setPendingEmail(user.pendingEmail ?? null);
      })
      .catch(() => undefined);
  }, []);

  const updateProfile = <K extends keyof typeof profile>(field: K, value: (typeof profile)[K]) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { avatarUrl } = await authApi.uploadAvatar(file);
      setAvatar(avatarUrl);
      setStatusMessage("Profile photo updated successfully.");
      setSaved(true);
    } catch (caught) {
      setStatusMessage(caught instanceof ApiError ? caught.message : "Could not upload profile photo.");
      setSaved(true);
    }
    event.target.value = "";
  };

  const handleSave = async () => {
    try {
      const { user } = await authApi.updateProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        email: profile.email,
      });
      setPendingEmail(user.pendingEmail ?? null);
      setStatusMessage(
        user.pendingEmail
          ? `Profile saved. Confirm the new email sent to ${user.pendingEmail}.`
          : "Profile updated successfully.",
      );
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (caught) {
      setStatusMessage(caught instanceof ApiError ? caught.message : "Could not save profile.");
      setSaved(true);
    }
  };

  const handlePassword = async () => {
    try {
      await authApi.changePassword({ currentPassword, newPassword, confirmPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setStatusMessage("Password changed. Other devices were signed out.");
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (caught) {
      setStatusMessage(caught instanceof ApiError ? caught.message : "Could not change password.");
      setSaved(true);
    }
  };

  return (
    <div className="space-y-6 pb-10 text-navy">
      <nav className="text-[10px] text-slate-soft">
        Home <span className="mx-2">›</span> My Account <span className="mx-2">›</span>
        <span className="text-navy">Profile Information</span>
      </nav>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy">Profile Information</h1>
          <p className="mt-1 text-[10px] text-slate-soft">
            Manage your personal details, security settings, and communication preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-[10px] font-bold text-white shadow-sm transition hover:bg-green-700"
        >
          <FiSave size={12} />
          Save Changes
        </button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <main className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-extrabold text-navy">Personal Information</h2>
              <span className="rounded bg-green-soft px-2 py-1 text-[8px] font-bold text-green-600">
                Profile Active
              </span>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-[120px_minmax(0,1fr)]">
              <div className="text-center">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-gray-100 bg-gray-50">
                  <img src={avatar} alt={profile.fullName} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-white text-navy shadow-md transition hover:text-green-600"
                    aria-label="Upload profile photo"
                  >
                    <FiCamera size={12} />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 inline-flex items-center justify-center rounded border border-green-500 px-3 py-1.5 text-[8px] font-bold text-green-600 transition hover:bg-green-50"
                >
                  Change Photo
                </button>
                <p className="mt-2 text-[8px] text-slate-soft">JPG, PNG or WebP. Max size 2MB.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Full Name" value={profile.fullName} onChange={(value) => updateProfile("fullName", value)} />
                <Field
                  label="Email Address"
                  value={profile.email}
                  onChange={(value) => updateProfile("email", value)}
                  verified={verified && !pendingEmail}
                />
                <Field
                  label="Mobile Number"
                  value={profile.phone}
                  onChange={(value) => updateProfile("phone", value)}
                  verified
                />
                <Field
                  label="Date of Birth"
                  value={profile.dob}
                  onChange={(value) => updateProfile("dob", value)}
                  type="date"
                />
                <label className="grid gap-1 text-[9px] font-bold text-navy sm:col-span-2">
                  Gender
                  <AnimatedSelect
                    value={profile.gender}
                    onChange={(event) => updateProfile("gender", event.target.value)}
                    size="sm"
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Prefer not to say", label: "Prefer not to say" },
                    ]}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
            <h2 className="text-xs font-extrabold text-navy">Account Security</h2>
            <p className="mt-1 text-[8px] text-slate-soft">
              Update your password and keep your account protected.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />
              <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} />
              <PasswordField
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-green-soft p-3 text-[8px] text-slate-soft sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <FiShield className="text-green-600" />
                <span>Use at least 8 characters with a mix of letters, numbers, and symbols.</span>
              </div>
              <button
                type="button"
                onClick={handlePassword}
                className="ml-auto rounded border border-green-500 px-3 py-1.5 font-bold text-green-600 transition hover:bg-white"
              >
                Update Password
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
            <h2 className="text-xs font-extrabold text-navy">Communication Preferences</h2>

            <div className="mt-4 grid gap-3">
              <ToggleRow
                label="Email Notifications"
                description="Receive order updates, offers, and account alerts by email."
                enabled={emailAlerts}
                onToggle={() => setEmailAlerts((current) => !current)}
              />
              <ToggleRow
                label="SMS Notifications"
                description="Get important updates about orders and delivery status on SMS."
                enabled={smsAlerts}
                onToggle={() => setSmsAlerts((current) => !current)}
              />
              <ToggleRow
                label="WhatsApp Notifications"
                description="Receive quick status notifications and offers on WhatsApp."
                enabled={whatsappAlerts}
                onToggle={() => setWhatsappAlerts((current) => !current)}
              />
              <ToggleRow
                label="Marketing Emails"
                description="Stay informed about new products, promotions, and health tips."
                enabled={marketingEmails}
                onToggle={() => setMarketingEmails((current) => !current)}
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="mt-5 w-full rounded-xl bg-green-600 px-4 py-2.5 text-[9px] font-bold text-white transition hover:bg-green-700"
            >
              Save Communication Preferences
            </button>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xs font-extrabold text-navy">Recommended for You</h2>
                <p className="mt-1 text-[8px] text-slate-soft">
                  Explore products curated based on your wellness goals.
                </p>
              </div>
              <Link href="/shop" className="text-[8px] font-bold text-green-600">
                View All Products <FiChevronRight className="ml-1 inline" size={10} />
              </Link>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {PRODUCTS.slice(0, 4).map((product) => (
                <article key={product.id} className="rounded-xl border border-line bg-[#f9fbfd] p-3">
                  <img src={product.image} alt={product.name} className="mx-auto h-24 object-contain" />
                  <p className="mt-3 truncate text-[9px] font-bold text-navy">{product.name}</p>
                  <p className="mt-1 text-[10px] font-extrabold text-navy">{money(product.price)}</p>
                  <AddToCartButton
                    productId={product.id}
                    className="mt-3 w-full rounded border border-line px-2 py-1.5 text-[8px] font-bold text-navy transition hover:border-green-500 hover:text-green-600"
                  />
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-4 shadow-soft">
            <h2 className="text-xs font-extrabold text-navy">Account Overview</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-soft text-green-600">
                <FiUser size={18} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-navy">{profile.fullName}</p>
                <p className="text-[8px] text-slate-soft">Member since May 2023</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 border-t border-line pt-4 text-[8px] text-slate-soft">
              <p className="flex justify-between">
                <span>Total Orders</span>
                <b className="text-navy">12</b>
              </p>
              <p className="flex justify-between">
                <span>Total Spent</span>
                <b className="text-navy">₹28,745</b>
              </p>
              <p className="flex justify-between">
                <span>Reward Points</span>
                <b className="text-amber-500">560 pts</b>
              </p>
            </div>

            <Link
              href="/my-account/orders"
              className="mt-4 block rounded border border-green-500 px-3 py-2 text-center text-[8px] font-bold text-green-600 transition hover:bg-green-50"
            >
              View Order History
            </Link>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 shadow-soft">
            <h2 className="text-xs font-extrabold text-navy">Verification Status</h2>

            <div className="mt-4 space-y-3 text-[8px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-soft">Email</span>
                <span className="inline-flex items-center gap-1 text-green-600">
                  <FiCheck size={10} /> Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-soft">Phone</span>
                <span className="inline-flex items-center gap-1 text-green-600">
                  <FiCheck size={10} /> Verified
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="mt-4 w-full rounded border border-green-500 px-3 py-2 text-[8px] font-bold text-green-600 transition hover:bg-green-50"
            >
              Update Contact Info
            </button>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 shadow-soft">
            <h2 className="text-xs font-extrabold text-navy">Quick Links</h2>
            <div className="mt-3 space-y-2">
              {quickLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-[8px] text-slate-soft transition hover:bg-gray-50 hover:text-navy"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-soft text-green-600">
                    <Icon size={12} />
                  </span>
                  <span className="flex-1">{label}</span>
                  <FiChevronRight size={10} />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-green-soft p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-600">
                <FiKey size={16} />
              </span>
              <div>
                <p className="text-[10px] font-extrabold text-navy">Account Security</p>
                <p className="text-[8px] text-slate-soft">Strong password protection enabled.</p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {saved && (
        <div className="fixed bottom-5 right-5 rounded-xl bg-slate-900 px-4 py-3 text-[10px] font-bold text-white shadow-xl">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
