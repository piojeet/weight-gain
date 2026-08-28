
"use client";

import Link from "next/link";
import { useState } from "react";
import type { IconType } from "react-icons";
import { FiArrowRight, FiBell, FiCamera, FiCheck, FiChevronRight, FiCreditCard, FiEye, FiEyeOff, FiLock, FiMapPin, FiTrash2 } from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import { useCart } from "@/app/hooks/useCart";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const quickLinks: [string, string, IconType][] = [
  ["Change Password", "#security", FiLock],
  ["Manage Addresses", "/my-account/addresses", FiMapPin],
  ["Payment Methods", "/my-account/payment-methods", FiCreditCard],
  ["Notification Settings", "/my-account/notifications", FiBell],
  ["Delete Account", "#", FiTrash2],
];

function Field({ label, value, onChange, type = "text", verified = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; verified?: boolean }) {
  return <label className="grid gap-1 text-[9px] font-bold text-navy">{label}<span className="relative"><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-8 w-full rounded border border-line px-2 text-[9px] font-normal outline-none focus:border-green-500" />{verified && <span className="absolute right-2 top-2 rounded bg-green-soft px-1.5 py-0.5 text-[8px] font-bold text-green-600">Verified</span>}</span></label>;
}

function PasswordField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [visible, setVisible] = useState(false);
  return <label className="grid gap-1 text-[9px] font-bold text-navy">{label}<span className="relative"><input type={visible ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={label.replace("*", "")} className="h-8 w-full rounded border border-line px-2 pr-8 text-[9px] font-normal outline-none focus:border-green-500" /><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)} className="absolute right-2 top-2 text-slate-soft">{visible ? <FiEyeOff /> : <FiEye />}</button></span></label>;
}

export default function ProfilePage() {
  const { addItem } = useCart();
  const [name, setName] = useState("Rahul Sharma");
  const [email, setEmail] = useState("rahul.sharma@email.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [birthDate, setBirthDate] = useState("15 / 08 / 1997");
  const [gender, setGender] = useState("Male");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photo, setPhoto] = useState("/trusted-users/user1.jpg");
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState([true, true, false, true]);
  const suggestions = PRODUCTS.slice(0, 6);
  const togglePreference = (index: number) => setPreferences((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value));

  return <div className="bg-[#fbfcfd] pb-12">
    <nav className="text-[10px] text-slate-soft">Home <span className="mx-2">›</span> My Account <span className="mx-2">›</span> <span className="text-navy">Profile Information</span></nav>
    <header className="mt-5 flex items-end justify-between"><div><h1 className="text-2xl font-extrabold text-navy">Profile Information</h1><p className="mt-1 text-[10px] text-slate-soft">Manage your personal details and account preferences.</p></div><span className="text-[8px] text-slate-soft">Last updated: 18 May 2024, 10:30 AM</span></header>

    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_176px]">
      <div className="min-w-0">
        <section className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Personal Information</h2><div className="mt-4 grid gap-5 sm:grid-cols-[105px_minmax(0,1fr)]"><div className="text-center"><div className="relative mx-auto size-24 overflow-hidden rounded-full border-4 border-gray-100"><img src={photo} alt="Rahul Sharma" className="size-full object-cover" /><label className="absolute bottom-0 right-0 flex size-6 cursor-pointer items-center justify-center rounded-full bg-white text-navy shadow"><FiCamera size={12} /><input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)); }} /></label></div><p className="mt-2 text-[8px] text-slate-soft">JPG, PNG or WebP. Max size 2MB.</p><label className="mt-2 inline-block cursor-pointer rounded border border-green-500 px-3 py-1.5 text-[8px] font-bold text-green-600">Change Photo<input type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)); }} /></label></div><div className="grid gap-2 sm:grid-cols-2"><Field label="Full Name" value={name} onChange={setName} /><Field label="Email Address" value={email} onChange={setEmail} verified /><Field label="Mobile Number" value={phone} onChange={setPhone} verified /><Field label="Date of Birth" value={birthDate} onChange={setBirthDate} /><label className="grid gap-1 text-[9px] font-bold text-navy">Gender<select value={gender} onChange={(event) => setGender(event.target.value)} className="h-8 rounded border border-line px-2 text-[9px] font-normal outline-none"><option>Male</option><option>Female</option><option>Prefer not to say</option></select></label></div></div></section>

        <section className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Account Security</h2><div className="mt-4 grid gap-2"><PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} /><PasswordField label="New Password" value={newPassword} onChange={setNewPassword} /><PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} /></div><div className="mt-3 flex items-center gap-2 rounded bg-green-soft p-2 text-[8px] text-slate-soft"><FiLock className="text-green-600" /> Use a strong password with at least 8 characters, including letters, numbers & symbols.<button type="button" className="ml-auto rounded border border-green-500 px-2 py-1 font-bold text-green-600" onClick={() => setSaved(true)}>Update Password</button></div></section>

        <section className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Communication Preferences</h2><div className="mt-4 grid gap-3">{["Email Notifications", "SMS Notifications", "WhatsApp Notifications", "Marketing Emails"].map((label, index) => <div key={label} className="flex items-center justify-between"><div><p className="text-[9px] font-bold text-navy">{label}</p><p className="text-[8px] text-slate-soft">{["Get updates about your orders, offers and new products", "Receive order updates and important alerts on SMS", "Receive updates on WhatsApp", "Get personalised offers and health tips"][index]}</p></div><button type="button" aria-label={`Toggle ${label}`} onClick={() => togglePreference(index)} className={`relative h-4 w-8 rounded-full ${preferences[index] ? "bg-green-600" : "bg-slate-300"}`}><span className={`absolute top-0.5 size-3 rounded-full bg-white transition-transform ${preferences[index] ? "translate-x-4" : "translate-x-0.5"}`} /></button></div>)}</div><button type="button" onClick={() => setSaved(true)} className="mt-4 w-full rounded bg-green-600 py-2 text-[9px] font-bold text-white">Save Changes</button>{saved && <p className="mt-2 text-center text-[9px] font-bold text-green-600"><FiCheck className="mr-1 inline" /> Changes saved successfully</p>}</section>
      </div>

      <aside className="grid content-start gap-4"><section className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Account Overview</h2><div className="mt-4 grid gap-3 text-[8px] text-slate-soft"><p>Member Since <b className="float-right text-navy">18 April 2024</b></p><p>Account Status <b className="float-right rounded bg-green-soft px-1.5 py-0.5 text-green-600">Active</b></p><p>Total Orders <b className="float-right text-navy">12</b></p><p>Total Spent <b className="float-right text-navy">₹28,745</b></p><p>Reward Points <b className="float-right text-navy">560 pts</b></p></div><Link href="/my-account/orders" className="mt-4 block rounded border border-[#bdc8d6] py-1.5 text-center text-[8px] font-bold">View Order History</Link></section><section className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Email & Phone Verification</h2><div className="mt-4 grid gap-4 text-[8px]"><p><b>Email Address</b><br /><span className="text-slate-soft">{email}</span><strong className="float-right text-green-600">Verified ✓</strong></p><p><b>Phone Number</b><br /><span className="text-slate-soft">{phone}</span><strong className="float-right text-green-600">Verified ✓</strong></p></div><button type="button" onClick={() => setSaved(true)} className="mt-4 w-full rounded border border-green-500 py-1.5 text-[8px] font-bold text-green-600">Update Contact Info</button></section><section className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Quick Links</h2><div className="mt-3 grid gap-3 text-[8px]">{quickLinks.map(([label, href, Icon]) => <Link key={label} href={href} className="flex items-center gap-2 text-slate-soft"><Icon /><span>{label}</span><FiChevronRight className="ml-auto" /></Link>)}</div></section><section className="rounded-lg bg-green-soft p-4"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-full border-2 border-green-600 text-[10px] font-extrabold text-green-600">80%</div><div><p className="text-[9px] font-extrabold">Complete your profile</p><p className="text-[8px] text-slate-soft">and get better recommendations</p></div></div><div className="mt-3 grid gap-1 text-[8px] text-slate-soft"><span>✓ Add Profile Photo</span><span>✓ Add Date of Birth</span><span>✓ Verify Email</span><span>□ Add Nutrition Goal</span></div><Link href="/my-account/nutrition-goals" className="mt-3 block rounded border border-green-500 py-1.5 text-center text-[8px] font-bold text-green-600">Complete Now</Link></section></aside>
    </div>

    <section className="mt-5"><div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-extrabold">You May Also Like</h2><Link href="/shop" className="text-[8px] font-bold text-green-600">View All Products <FiArrowRight className="inline" /></Link></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{suggestions.map((product) => <article key={product.id} className="rounded-md border border-line bg-white p-2 shadow-sm"><img src={product.image} alt={product.name} className="mx-auto h-20 object-contain" /><p className="truncate text-[8px] font-bold">{product.name}</p><p className="mt-1 text-[9px] font-extrabold">{money(product.price)}</p><button type="button" onClick={() => addItem(product.id)} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold">Add to Cart</button></article>)}</div></section>
  </div>;
}
