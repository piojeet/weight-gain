"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    FiBell,
    FiBox,
    FiChevronDown,
    FiCreditCard,
    FiHome,
    FiLogOut,
    FiMapPin,
    FiSettings,
    FiStar,
    FiTag,
    FiTarget,
    FiUser
} from "react-icons/fi";

const links = [
    [
        "Dashboard", "/my-account/dashboard", FiHome
    ],
    [
        "My Orders", "/my-account/orders", FiBox
    ],
    [
        "Addresses", "/my-account/addresses", FiMapPin
    ],
    [
        "Profile Information", "/my-account/profile", FiUser
    ],
    [
        "Payment Methods", "/my-account/payment-methods", FiCreditCard
    ],
    [
        "My Reviews", "/my-account/reviews", FiStar
    ],
    [
        "My Coupons", "/my-account/coupons", FiTag
    ],
    [
        "Nutrition Goals", "/my-account/nutrition-goals", FiTarget
    ],
    [
        "Notification Settings", "/my-account/notifications", FiBell
    ],
    [
        "Account Settings", "/my-account", FiSettings
    ]
] as const;

export default function AccountSidebar({
    activeLabel
} : {
    activeLabel? : string
}) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return <aside className="rounded-xl border border-line bg-white p-4 shadow-soft lg:sticky lg:top-5 lg:h-fit">
        <div className="flex items-center gap-3 border-b border-line pb-5">
            <span className="flex size-12 items-center justify-center rounded-full bg-gray-100 text-lg text-navy">R</span>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-navy">Rahul Sharma</p>
                <p className="mt-1 text-[10px] text-slate-soft">rahul.sharma@email.com</p>
                <span className="mt-1 inline-block rounded bg-green-soft px-2 py-1 text-[9px] font-bold text-green-600">Verified</span>
            </div>
            <button type="button" aria-expanded={menuOpen} aria-controls="account-navigation" onClick={() => setMenuOpen((open) => !open)} className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line text-navy lg:hidden" aria-label="Toggle account menu">
                <FiChevronDown className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
        </div>
        <nav id="account-navigation" className={`${menuOpen ? "grid" : "hidden"} mt-4 gap-1 lg:grid`}>
            {
            links.map(([label, href, Icon]) => <Link key={label}
                href={href}
                className={
                        `flex items-center gap-3 rounded-md px-3 py-2 text-xs ${
                        (activeLabel ? label === activeLabel : pathname === href) ? "bg-green-soft font-bold text-green-600" : "text-navy hover:bg-gray-50"
                    }`
            }><Icon/>{label}</Link>)
        }
            <button type="button" className="mt-2 flex items-center gap-3 border-t border-line px-3 pt-4 text-xs text-navy"><FiLogOut/>Log Out</button>
        </nav>
        <div className="mt-5 rounded-lg bg-[#f3f8fc] p-4">
            <p className="text-xs font-bold text-navy">Need Help?</p>
            <p className="mt-1 text-[10px] text-slate-soft">We&apos;re here for you.</p>
            <button type="button" className="mt-3 rounded border border-green-500 px-3 py-2 text-[10px] font-bold text-green-600">Contact Support</button>
        </div>
    </aside>;
}
