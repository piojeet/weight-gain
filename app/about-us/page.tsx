
"use client";

import Link from "next/link";
import { useState } from "react";
import type { IconType } from "react-icons";
import { FiArrowRight, FiAward, FiCheck, FiGlobe, FiHeart, FiPlay, FiShield, FiStar, FiTarget, FiUsers, FiX } from "react-icons/fi";

const FiLeaf = FiShield;
const FiScale = FiShield;

const values: [IconType, string, string][] = [
  [FiLeaf, "Clean Ingredients", "No banned substances. Only what your body needs."],
  [FiAward, "Science Backed", "Every product is researched & tested."],
  [FiShield, "Lab Tested", "Rigorously tested for purity and safety."],
  [FiStar, "Premium Quality", "Made in world-class GMP certified facilities."],
  [FiHeart, "Customer First", "We&apos;re here for you at every step."],
  [FiGlobe, "Sustainable", "Better for you and the planet."],
] as const;
const team = [
  ["RS", "Rahul Sharma", "Co-Founder & CEO", "#b87945"],
  ["NV", "Dr. Neha Verma", "Head - Nutrition Science", "#e8a37d"],
  ["AK", "Amit Khanna", "Head - Product Development", "#b9784a"],
  ["PM", "Pooja Mehta", "Head - Quality Assurance", "#bc7d64"],
  ["KM", "Karan Malhotra", "Co-Founder & CMO", "#b87440"],
] as const;
const milestones = [
  ["2018", "The Idea Was Born", "A small idea with a big mission to transform nutrition in India."],
  ["2019", "First Product Launch", "Launched our first range of clean whey proteins."],
  ["2021", "Reaching More People", "Expanded to 100+ products and served 500K+ customers."],
  ["2024 & Beyond", "Building a Healthier World", "Continuing to innovate and make nutrition accessible to all."],
] as const;

export default function AboutUsPage() {
  const [storyOpen, setStoryOpen] = useState(false);
  return <section className="container-page bg-[#fbfcfe] py-7 text-navy">
    <div className="text-[10px] text-slate-soft">Home <span className="mx-2">›</span> <span className="text-navy">About Us</span></div>
    <div className="relative mt-3 min-h-[250px] overflow-hidden rounded-lg border border-line bg-white px-5 py-6 shadow-sm sm:px-8"><div className="relative z-10 max-w-sm"><h1 className="text-[28px] font-extrabold tracking-tight sm:text-[34px]">About TheGrowthHealth</h1><p className="mt-1 text-sm font-bold text-green-600">Fueling Health. Transforming Lives.</p><p className="mt-3 text-[9px] leading-4 text-slate-soft">TheGrowthHealth was born out of a simple belief - nutrition should be clean, effective and accessible to everyone.</p><p className="mt-2 text-[9px] leading-4 text-slate-soft">We combine the power of science and nature to create high-quality supplements that help you become the best version of yourself.</p><div className="mt-5 grid grid-cols-3 gap-2 text-[8px]"><span className="flex items-center gap-2"><FiShield className="text-green-600" /><b>Trusted by 1M+<small className="block font-normal text-slate-soft">Happy Customers</small></b></span><span className="flex items-center gap-2"><FiAward className="text-green-600" /><b>Science Backed<small className="block font-normal text-slate-soft">Formulations</small></b></span><span className="flex items-center gap-2"><FiCheck className="text-green-600" /><b>Honest Nutrition<small className="block font-normal text-slate-soft">Always</small></b></span></div></div><div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-80 md:block" /><button type="button" onClick={() => setStoryOpen(true)} className="absolute bottom-8 right-[27%] z-10 hidden items-center gap-2 rounded-full bg-white px-3 py-2 text-[9px] font-bold shadow-lg md:flex"><span className="flex size-8 items-center justify-center rounded-full bg-green-600 text-white"><FiPlay /></span>Watch Our Story</button></div>

    <div className="mt-4 grid gap-3 rounded-lg border border-green-100 bg-[#f5fbf6] p-4 sm:grid-cols-2 sm:p-5"><div className="flex gap-3 border-b border-green-100 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-5"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-soft text-green-600"><FiTarget size={19} /></span><div><h2 className="text-xs font-extrabold">Our Mission</h2><p className="mt-1 text-[8px] leading-3 text-slate-soft">To empower people to live healthier, stronger lives by providing science-backed nutrition made with clean, safe and effective ingredients.</p></div></div><div className="flex gap-3 sm:pl-2"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-soft text-green-600"><FiGlobe size={19} /></span><div><h2 className="text-xs font-extrabold">Our Vision</h2><p className="mt-1 text-[8px] leading-3 text-slate-soft">To be India&apos;s most trusted nutrition brand and a global leader in clean, effective and sustainable health solutions.</p></div></div></div>

    <div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Why Choose TheGrowthHealth?</h2><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{values.map(([Icon, title, detail]) => <div key={title} className="text-center sm:text-left"><span className="mx-auto flex size-8 items-center justify-center rounded-full border border-green-500 text-green-600 sm:mx-0"><Icon size={16} /></span><p className="mt-2 text-[9px] font-extrabold">{title}</p><p className="mt-1 text-[8px] leading-3 text-slate-soft">{detail}</p></div>)}</div></div>

    {/* @ts-ignore: the compact metrics tuple is intentionally rendered inline. */}
    <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)_minmax(260px,1.1fr)]"><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">Our Journey</h2><div className="mt-4 grid gap-3 border-l border-green-300 pl-4">{milestones.map(([year, title, detail]) => <div key={year} className="relative"><span className="absolute -left-[22px] top-0 flex size-4 items-center justify-center rounded-full border border-green-600 bg-white"><span className="size-1.5 rounded-full bg-green-600" /></span><b className="text-[9px] text-green-600">{year}</b><p className="text-[9px] font-extrabold">{title}</p><p className="mt-1 text-[8px] leading-3 text-slate-soft">{detail}</p></div>)}</div><button type="button" className="mt-4 rounded border border-green-500 px-4 py-2 text-[8px] font-bold text-green-600">View Our Milestones <FiArrowRight className="ml-1 inline" /></button></div><div className="rounded-lg border border-line bg-white p-4 shadow-sm"><h2 className="text-xs font-extrabold">TheGrowthHealth in Numbers</h2><div className="mt-4 grid grid-cols-2 gap-2">{[[FiUsers, "1M+", "Happy Customers"], [FiHeart, "100+", "Premium Products"], [FiAward, "4.8/5", "Average Rating"], [FiGlobe, "25K+", "Cities Served"]].map(([Icon, value, label]) => <div key={value as string} className="rounded-md border border-[#edf0f4] p-4 text-center"><Icon className="mx-auto text-green-600" /><p className="mt-2 text-base font-extrabold">{value}</p><p className="text-[8px] text-slate-soft">{label}</p></div>)}</div></div><div className="flex flex-col justify-between rounded-lg bg-[#004a35] p-5 text-white shadow-sm"><div><span className="text-3xl text-green-200">“</span><p className="mt-2 text-sm font-bold leading-5">We believe that real results come from real nutrition. That&apos;s why we never compromise on quality and transparency.</p><p className="mt-4 text-[9px] font-bold">- Team TheGrowthHealth</p></div><div className="mt-5 grid grid-cols-3 border-t border-white/25 pt-4 text-center text-[8px]"><span><FiShield className="mx-auto mb-1" />Transparency</span><span><FiScale className="mx-auto mb-1" />Integrity</span><span><FiAward className="mx-auto mb-1" />Excellence</span></div></div></div>

    <div className="mt-4 rounded-lg border border-line bg-white p-4 shadow-sm"><div><h2 className="text-xs font-extrabold">Meet The People Behind TheGrowthHealth</h2><p className="mt-1 text-[9px] text-slate-soft">A team of nutrition experts, scientists and fitness enthusiasts working together for your better health.</p></div><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">{team.map(([initials, name, role, color]) => <div key={name} className="rounded-md border border-[#edf0f4] p-2 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-full text-lg font-extrabold text-white" style={{ backgroundColor: color }}>{initials}</span><p className="mt-2 text-[8px] font-extrabold">{name}</p><p className="mt-1 text-[7px] leading-3 text-slate-soft">{role}</p><span className="mt-1 inline-block text-[9px] font-bold text-blue-600">in</span></div>)}<div className="flex flex-col justify-center rounded-md bg-[#f3faf4] p-3 text-center"><FiUsers className="mx-auto text-green-600" /><p className="mt-2 text-[9px] font-extrabold">We&apos;re Hiring!</p><p className="mt-1 text-[8px] text-slate-soft">Passionate about health and fitness? Join our mission.</p><Link href="/careers" className="mt-3 rounded border border-green-500 px-2 py-1.5 text-[8px] font-bold text-green-600">View Careers</Link></div></div></div>

    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-white p-4"><h2 className="text-xs font-extrabold">Certifications &amp; Trust</h2><div className="flex flex-wrap items-center gap-5 text-[9px] font-extrabold text-slate-soft"><span>FSSAI</span><span className="text-base">GMP</span><span>ISO<br /><small className="text-[7px]">22000:2018</small></span><span>HACCP</span><span><FiShield className="mx-auto text-green-600" />LAB TESTED</span><span>CRUELTY<br />FREE</span></div></div>

    {storyOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-navy-900/60 p-4"><div className="relative max-w-md rounded-lg bg-white p-6 shadow-xl"><button type="button" onClick={() => setStoryOpen(false)} aria-label="Close story" className="absolute right-4 top-4 text-slate-soft"><FiX /></button><FiPlay className="mx-auto text-green-600" size={30} /><h2 className="mt-3 text-center text-lg font-extrabold">Our Story</h2><p className="mt-2 text-center text-xs leading-5 text-slate-soft">TheGrowthHealth started with one promise: make clean, science-backed nutrition accessible to every Indian household.</p><button type="button" onClick={() => setStoryOpen(false)} className="mx-auto mt-4 block rounded bg-green-600 px-5 py-2 text-[10px] font-bold text-white">Close</button></div></div>}
  </section>;
}
