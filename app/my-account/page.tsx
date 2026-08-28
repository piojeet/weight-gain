"use client";

import Link from "next/link";
import { useState } from "react";
import type { IconType } from "react-icons";
import { FiArrowRight, FiBell, FiBookOpen, FiCheck, FiChevronRight, FiCreditCard, FiDownload, FiHeart, FiLock, FiMail, FiMapPin, FiMonitor, FiMoon, FiShield, FiTrash2, FiUser, FiUsers } from "react-icons/fi";
import { PRODUCTS } from "@/app/data/products";
import { useCart } from "@/app/hooks/useCart";
import { useWishlist } from "@/app/hooks/useWishlist";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const recommendations = [1, 2, 3, 4, 5, 6].flatMap((id) => { const product = PRODUCTS.find((item) => item.id === id); return product ? [product] : []; });
const preferenceRows: { icon: IconType; title: string; detail: string; action: string; href?: string; danger?: boolean }[] = [
	{ icon: FiUser, title: "Data & Privacy Settings", detail: "Manage your data, download or delete your account.", action: "Manage" },
	{ icon: FiBell, title: "Marketing Preferences", detail: "Control what type of emails and messages you receive.", action: "Manage" },
	{ icon: FiDownload, title: "Download My Data", detail: "Download a copy of your personal data.", action: "Download" },
	{ icon: FiTrash2, title: "Delete Account", detail: "Permanently delete your account and all data.", action: "Delete Account", danger: true },
];
const accountPreferences: { icon: IconType; title: string; detail: string; action: string; href: string }[] = [
	{ icon: FiMapPin, title: "Default Address", detail: "Set your default address for a smooth checkout.", action: "Manage Address", href: "/my-account/addresses" },
	{ icon: FiCreditCard, title: "Default Payment Method", detail: "Set your default payment method.", action: "Manage Payment", href: "/my-account/payment-methods" },
	{ icon: FiMail, title: "Email Preferences", detail: "Manage emails you receive from NutriGain.", action: "Manage Emails", href: "/my-account/notifications" },
];
const quickLinks: { label: string; href: string; icon: IconType }[] = [
	{ label: "Addresses", href: "/my-account/addresses", icon: FiLock },
	{ label: "Payment Methods", href: "/my-account/payment-methods", icon: FiLock },
	{ label: "Notification Settings", href: "/my-account/notifications", icon: FiBell },
	{ label: "Privacy Policy", href: "/privacy-policy", icon: FiShield },
	{ label: "Terms & Conditions", href: "/terms-of-service", icon: FiBookOpen },
];

function SettingRow({ icon: Icon, title, detail, action, href, danger, onClick }: { icon: IconType; title: string; detail: string; action: string; href?: string; danger?: boolean; onClick?: () => void }) {
	const content = <><span className={`flex size-8 items-center justify-center rounded-full ${danger ? "bg-red-50 text-red-500" : "bg-green-soft text-green-600"}`}><Icon size={15} /></span><div className="min-w-0 flex-1"><p className="text-[9px] font-extrabold">{title}</p><p className="mt-1 truncate text-[8px] text-slate-soft">{detail}</p></div><button type="button" onClick={onClick} className={`hidden min-w-19.5 rounded border px-2 py-1.5 text-[8px] font-bold sm:block ${danger ? "border-red-400 text-red-500" : "border-green-300 text-green-600"}`}>{action}</button><FiChevronRight className="text-slate-soft" size={13} /></>;
	return href ? <Link href={href} className="flex items-center gap-3 border-b border-[#edf0f4] py-3 last:border-0">{content}</Link> : <div className="flex items-center gap-3 border-b border-[#edf0f4] py-3 last:border-0">{content}</div>;
}

export default function MyAccountPage() {
	const [language, setLanguage] = useState("English");
	const [currency, setCurrency] = useState("INR (₹)");
	const [theme, setTheme] = useState("Dark");
	const [twoFactor, setTwoFactor] = useState(true);
	const [saved, setSaved] = useState(false);
	const { addItem } = useCart();
	const { isWishlisted, toggleWishlist } = useWishlist();
	const save = () => setSaved(true);

	return <section className="bg-[#fbfcfe] py-7 text-navy">
		<div className="text-[10px] text-slate-soft">Home <span className="mx-2">›</span> My Account <span className="mx-2">›</span> <span className="text-navy">Account Settings</span></div>
		<div className="mt-3"><h1 className="text-[22px] font-extrabold tracking-tight">Account Settings</h1><p className="mt-1 text-xs text-slate-soft">Manage your account preferences and security settings.</p></div>
		<div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_235px]">
			<main className="min-w-0">
				<div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Profile &amp; Preferences</h2><p className="mt-1 text-[8px] text-slate-soft">Manage your personal preferences and account details.</p><div className="mt-3 grid gap-1"><label className="flex items-center gap-3 border-b border-[#edf0f4] py-3"><span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600">文</span><span className="flex-1"><b className="block text-[9px]">Language</b><small className="text-[8px] text-slate-soft">Choose your preferred language.</small></span><select value={language} onChange={(event) => { setLanguage(event.target.value); setSaved(false); }} className="w-28 rounded border border-[#dce3eb] px-2 py-2 text-[8px]"><option>English</option><option>Hindi</option></select></label><label className="flex items-center gap-3 border-b border-[#edf0f4] py-3"><span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-sm text-green-600">₹</span><span className="flex-1"><b className="block text-[9px]">Currency</b><small className="text-[8px] text-slate-soft">Select your preferred currency.</small></span><select value={currency} onChange={(event) => { setCurrency(event.target.value); setSaved(false); }} className="w-28 rounded border border-[#dce3eb] px-2 py-2 text-[8px]"><option>INR (₹)</option><option>USD ($)</option></select></label><div className="flex items-center gap-3 py-3"><span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600"><FiMoon size={15} /></span><span className="flex-1"><b className="block text-[9px]">Theme</b><small className="text-[8px] text-slate-soft">Choose your preferred theme for the website.</small></span><div className="flex rounded border border-[#dce3eb] p-0.5 text-[8px]">{["Light", "Dark", "System"].map((value) => <button key={value} type="button" onClick={() => { setTheme(value); setSaved(false); }} className={`rounded px-3 py-1.5 ${theme === value ? "bg-green-600 text-white" : "text-slate-soft"}`}>{value}</button>)}</div></div></div></div>

				<div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Password &amp; Security</h2><p className="mt-1 text-[8px] text-slate-soft">Keep your account secure.</p><div className="mt-2"><SettingRow icon={FiLock} title="Change Password" detail="Update your password regularly to keep your account safe." action="Change Password" onClick={() => alert("Password change flow coming soon.")} /><div className="flex items-center gap-3 border-b border-[#edf0f4] py-3"><span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600"><FiShield size={15} /></span><div className="flex-1"><p className="text-[9px] font-extrabold">Two-Factor Authentication (2FA)</p><p className="mt-1 text-[8px] text-slate-soft">Add an extra layer of security to your account.</p></div><button type="button" onClick={() => setTwoFactor((value) => !value)} className={`flex items-center gap-1 rounded border px-3 py-1.5 text-[8px] font-bold ${twoFactor ? "border-green-300 text-green-600" : "border-[#bdc8d6] text-slate-soft"}`}><FiCheck /> {twoFactor ? "Enabled" : "Enable"}</button><FiChevronRight className="text-slate-soft" size={13} /></div><SettingRow icon={FiMonitor} title="Login Activity" detail="See your recent login activity and devices." action="View Activity" /></div></div>

				<div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Privacy &amp; Data</h2><p className="mt-1 text-[8px] text-slate-soft">Manage your data and privacy preferences.</p>{preferenceRows.map((row) => <SettingRow key={row.title} {...row} onClick={() => row.danger ? alert("Account deletion requires confirmation.") : save()} />)}</div>
				<div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Account Preferences</h2><p className="mt-1 text-[8px] text-slate-soft">Set your general account preferences.</p>{accountPreferences.map((row) => <SettingRow key={row.title} {...row} />)}</div>
				{saved && <p className="mt-3 text-center text-[9px] font-bold text-green-600">Your preferences have been saved.</p>}
			</main>

			<aside className="grid content-start gap-4"><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Account Overview</h2><div className="mt-4 flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-full bg-green-soft text-green-600"><FiUser size={22} /></span><div><p className="text-[10px] font-extrabold">Rahul Sharma</p><p className="text-[8px] text-slate-soft">Member since May 2023</p><span className="mt-1 inline-block rounded bg-green-soft px-2 py-1 text-[7px] font-bold text-green-600">Premium Member</span></div></div><div className="mt-4 grid gap-3 border-t border-line pt-4 text-[8px]"><p className="flex justify-between"><span>Total Orders</span><b>24</b></p><p className="flex justify-between"><span>Total Spent</span><b>₹18,450</b></p><p className="flex justify-between"><span>Reward Points</span><b className="text-amber-500">● 350</b></p></div><button type="button" className="mt-4 w-full rounded border border-green-500 py-2 text-[8px] font-bold text-green-600">View Membership Benefits</button></div><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Security Strength</h2><div className="mt-3 flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600"><FiShield /></span><div><b className="block text-[10px] text-green-600">Strong</b><small className="text-[8px] text-slate-soft">Great! Your account is well protected.</small></div></div><div className="mt-4 h-1 rounded-full bg-gray-100"><div className="h-full w-[82%] rounded-full bg-green-600" /></div>{["Password is strong", "2FA is enabled", "Recovery email set", "Phone number verified"].map((item) => <p key={item} className="mt-3 flex items-center gap-2 text-[8px]"><span className="flex size-3 items-center justify-center rounded-full bg-green-600 text-white"><FiCheck size={8} /></span>{item}</p>)}</div><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Quick Links</h2>{quickLinks.map(({ label, href, icon: Icon }) => <Link key={label} href={href} className="mt-3 flex items-center gap-2 text-[8px] font-medium"><Icon className="text-slate-soft" size={12} />{label}<FiChevronRight className="ml-auto" /></Link>)}</div><div className="rounded-lg bg-[#f3f8fc] p-4"><div className="flex items-center gap-2"><FiUsers className="text-green-600" /><h2 className="text-xs font-extrabold">Need Help?</h2></div><p className="mt-2 text-[8px] text-slate-soft">Our support team is here to help you.</p><button type="button" className="mt-3 rounded border border-green-500 px-3 py-1.5 text-[9px] font-bold text-green-600">Contact Support</button></div></aside>
		</div>

		<div className="mt-5"><div className="mb-3 flex items-center justify-between"><div><h2 className="text-xs font-extrabold">Recommended for You</h2><p className="mt-1 text-[9px] text-slate-soft">Handpicked products you might be interested in</p></div><Link href="/shop" className="text-[9px] font-bold text-green-600">View All Products <FiArrowRight className="inline" /></Link></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{recommendations.map((product) => <div key={product.id} className="relative rounded-md border border-line bg-white p-2 shadow-sm"><button type="button" onClick={() => void toggleWishlist(product.id)} aria-label={`Wishlist ${product.name}`} className="absolute right-2 top-2 text-slate-soft"><FiHeart size={13} fill={isWishlisted(product.id) ? "currentColor" : "none"} /></button><img src={product.image} alt={product.name} className="mx-auto h-20 object-contain" /><p className="truncate text-[9px] font-bold">{product.name}</p><p className="mt-1 truncate text-[8px] text-slate-soft">{product.description}</p><p className="mt-1 text-[10px] font-extrabold">{money(product.price)}</p><p className="text-[8px] text-slate-soft line-through">{money(product.mrp ?? 0)}</p><button type="button" onClick={() => addItem(product.id)} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold hover:border-green-500 hover:text-green-600">Add to Cart</button></div>)}</div></div>
	</section>;
}
