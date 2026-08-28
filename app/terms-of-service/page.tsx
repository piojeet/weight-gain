"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  FileText,
  Mail,
  Phone,
  RefreshCcw,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  Truck,
  UserRound,
  WalletCards,
} from "lucide-react";

const SECTIONS = [
  { title: "Introduction", icon: ShieldCheck, description: "Welcome to NutriGain. These Terms of Service govern your access to and use of our website, products, and services." },
  { title: "Use of Our Services", icon: FileText, description: "By using our website, you agree to use it only for lawful purposes and in accordance with these Terms. You must be at least 18 years old to use our services." },
  { title: "Orders & Payments", icon: WalletCards, description: "All orders are subject to availability and confirmation. Prices are listed in INR and include applicable taxes. We reserve the right to refuse or cancel any order." },
  { title: "Shipping & Delivery", icon: Truck, description: "We aim to deliver your order within the estimated time. Delivery times may vary based on location and external factors." },
  { title: "Returns & Refunds", icon: RotateCcw, description: "Our Returns & Refunds Policy outlines the process and eligibility for returns, exchanges, and refunds. Please review it for complete details." },
  { title: "Intellectual Property", icon: ScrollText, description: "All content on this website, including text, graphics, logos, images, and designs, is the property of NutriGain and protected by applicable laws." },
  { title: "User Responsibilities", icon: UserRound, description: "You agree not to misuse our website, attempt unauthorized access, or engage in activities that may harm our systems or other users." },
  { title: "Limitation of Liability", icon: ShieldCheck, description: "NutriGain shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products." },
  { title: "Changes to Terms", icon: RefreshCcw, description: "We may update these Terms from time to time. Any changes will be posted on this page with the updated date." },
  { title: "Contact Us", icon: Mail, description: "If you have any questions about these Terms, please contact us using the details provided." },
] as const;

const TRUST_ITEMS = [
  { title: "Free Shipping", subtitle: "On orders above ₹1,999", icon: Truck },
  { title: "Lab Tested", subtitle: "Quality you can trust", icon: FileText },
  { title: "Secure Payments", subtitle: "100% safe checkout", icon: ShieldCheck },
  { title: "Easy Returns", subtitle: "Hassle-free returns", icon: RefreshCcw },
];

function DocumentIllustration() {
  return (
    <div className="relative h-28 w-56" aria-hidden="true">
      <div className="absolute right-10 top-1 h-24 w-20 rounded-t-lg bg-[#d9edd8] shadow-[inset_0_-8px_0_#c5e3c6]">
        <div className="mt-5 space-y-2 px-3 opacity-70">
          <span className="block h-1 w-12 rounded bg-[#8fc99b]" /><span className="block h-1 w-14 rounded bg-[#8fc99b]" /><span className="block h-1 w-11 rounded bg-[#8fc99b]" /><span className="block h-1 w-8 rounded bg-[#8fc99b]" />
        </div>
      </div>
      <div className="absolute bottom-1 right-5 flex size-12 items-center justify-center rounded-br-[18px] rounded-tl-[18px] bg-[#15933a] text-white shadow-lg"><Check className="size-7" strokeWidth={3} /></div>
      <span className="absolute bottom-0 left-3 h-10 w-24 rounded-full border-b-2 border-[#dcefdc] opacity-80" /><span className="absolute right-0 top-12 h-10 w-20 rounded-full border-b-2 border-[#dcefdc] opacity-80" />
    </div>
  );
}

export default function TermsOfServicePage() {
  const [openSection, setOpenSection] = useState<number | null>(null);

  return (
    <div className="bg-white text-[#0d1937]">
      <div className="container-page pb-8 pt-5 lg:pt-6">
        <div className="mb-5 flex items-center gap-2 text-xs text-[#52607a]"><Link href="/" className="hover:text-[#168b39]">Home</Link><ArrowRight className="size-3" /><span>Terms of Service</span></div>
        <header className="relative flex min-h-28 items-start justify-between border-b border-[#edf0f3] pb-5">
          <div><h1 className="text-[27px] font-bold tracking-[-0.04em] sm:text-3xl">Terms of Service</h1><p className="mt-2 text-[11px] sm:text-xs">Please read these terms carefully before using the NutriGain website and services.</p><p className="mt-1 text-[11px] text-[#52607a] sm:text-xs">Last updated: 26 May 2025</p></div>
          <div className="-mr-2 hidden sm:block"><DocumentIllustration /></div>
        </header>

        <div className="mt-0 grid gap-5 lg:grid-cols-[246px_minmax(0,1fr)_252px] lg:gap-5">
          <aside className="h-fit rounded-md border border-[#e4eaf0] p-2 lg:sticky lg:top-4"><nav aria-label="Terms sections" className="space-y-1">{SECTIONS.map(({ title, icon: Icon }, index) => <a key={title} href={`#section-${index + 1}`} className={`flex min-h-9 items-center gap-4 rounded-md px-3 text-xs font-semibold transition-colors ${index === 0 ? "bg-[#eef8ef] text-[#178637]" : "hover:bg-[#f5faf5]"}`}><Icon className="size-[17px] shrink-0" strokeWidth={1.8} /><span>{index + 1}. {title}</span></a>)}</nav></aside>

          <section aria-label="Terms of service sections" className="divide-y divide-[#edf0f3]">{SECTIONS.map(({ title, description }, index) => { const isOpen = openSection === index; return <article key={title} id={`section-${index + 1}`} className="scroll-mt-6"><button type="button" aria-expanded={isOpen} aria-controls={`section-content-${index + 1}`} onClick={() => setOpenSection((current) => current === index ? null : index)} className="flex w-full items-start gap-3 py-3 text-left"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#edf8ed] text-xs font-medium text-[#178637]">{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-xs font-bold sm:text-[13px]">{index + 1}. {title}</span><span className={`block text-[11px] leading-[1.45] text-[#202c45] ${isOpen ? "mt-1" : "line-clamp-2"}`}>{description}</span>{isOpen && <span id={`section-content-${index + 1}`} className="mt-2 block text-[11px] leading-[1.55] text-[#52607a]">By continuing to use NutriGain, you acknowledge that you have read, understood, and agreed to these terms.</span>}</span><ArrowDown className={`mt-1 size-3.5 shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#168b39]" : "text-[#18233d]"}`} /></button></article>; })}</section>

          <aside className="h-fit rounded-md border border-[#e4eaf0] p-5"><h2 className="text-sm font-bold">Need Help?</h2><p className="mt-3 text-[11px] leading-6">If you have any questions about these Terms, we&apos;re here to help.</p><div className="mt-3 space-y-3 text-[11px]"><a href="tel:+919876543210" className="flex items-center gap-4 hover:text-[#168b39]"><Phone className="size-4 text-[#168b39]" /> +91 98765 43210</a><a href="mailto:support@nutrigain.in" className="flex items-center gap-4 hover:text-[#168b39]"><Mail className="size-4 text-[#168b39]" /> support@nutrigain.in</a><p className="flex items-center gap-4"><CalendarDays className="size-4 text-[#168b39]" /> Mon - Sat: 10 AM - 7 PM</p></div><Link href="/contact" className="mt-5 flex h-9 items-center justify-center rounded bg-[#15933a] text-xs font-bold text-white transition-colors hover:bg-[#117c30]">Contact Support</Link></aside>
        </div>

        <div className="mt-1 grid rounded-md border border-[#e4eaf0] bg-white sm:grid-cols-2 lg:grid-cols-4">{TRUST_ITEMS.map(({ title, subtitle, icon: Icon }, index) => <div key={title} className={`flex items-center gap-3 px-5 py-2.5 ${index > 0 ? "border-t border-[#edf0f3] sm:border-l sm:border-t-0" : ""}`}><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eef8ef] text-[#168b39]"><Icon className="size-[18px]" /></span><span><strong className="block text-[11px] font-bold">{title}</strong><small className="block text-[10px] text-[#52607a]">{subtitle}</small></span></div>)}</div>
      </div>
    </div>
  );
}
