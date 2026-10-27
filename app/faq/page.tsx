// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiHeadphones,
  FiHeart,
  FiHelpCircle,
  FiMail,
  FiPackage,
  FiPhone,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { Button } from "@/components/ui/button";
import { AnimatedAccordionItem } from "@/components/ui/faq-tabs-card";
import { Input } from "@/components/ui/input";

type Faq = { question: string; answer: string; category: string };
type Category = { name: string; count: number; icon: IconType };
const faqs: Faq[] = [
  {
    question: "How long does delivery take?",
    answer:
      "We usually deliver orders within 2-6 business days depending on your location. You will receive a tracking link once your order is shipped.",
    category: "All Questions",
  },
  {
    question: "Do you offer free shipping?",
    answer: "Yes. Orders above ₹1,999 qualify for free shipping across India.",
    category: "Shipping & Delivery",
  },
  {
    question: "How can I track my order?",
    answer:
      "Open Order Tracking from your account or use the tracking link sent by email and SMS after dispatch.",
    category: "Orders & Payments",
  },
  {
    question: "Can I return or exchange a product?",
    answer:
      "Unopened and unused products can be returned within 7 days of delivery, subject to our return policy.",
    category: "Returns & Refunds",
  },
  {
    question: "What is your return policy?",
    answer:
      "Products must be unused, unopened, in original packaging, and accompanied by proof of purchase.",
    category: "Returns & Refunds",
  },
  {
    question: "How long does it take to get a refund?",
    answer:
      "Once the returned item is inspected and approved, refunds are processed within 5-7 business days.",
    category: "Returns & Refunds",
  },
  {
    question: "Are your products safe and lab tested?",
    answer:
      "Our products are made with carefully selected ingredients and tested for quality and safety.",
    category: "Products",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, cards, net banking, wallets, and cash on delivery where available.",
    category: "Payments & Offers",
  },
  {
    question: "Can I modify or cancel my order?",
    answer:
      "Contact support quickly to request a change. Orders can be cancelled before processing begins.",
    category: "Orders & Payments",
  },
  {
    question: "How should I store my supplements?",
    answer:
      "Keep supplements sealed in a cool, dry place away from direct sunlight and moisture.",
    category: "Products",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently deliver across India. International shipping availability may be added in the future.",
    category: "Shipping & Delivery",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Call +91 98765 43210 or email support@thegrowthhealth.com. Our team is available Monday-Saturday, 10 AM-7 PM.",
    category: "General",
  },
];
const categories: Category[] = [
  { name: "All Questions", count: 56, icon: FiBookOpen },
  { name: "Orders & Payments", count: 12, icon: FiCreditCard },
  { name: "Shipping & Delivery", count: 10, icon: FiTruck },
  { name: "Returns & Refunds", count: 8, icon: FiRefreshCw },
  { name: "Products", count: 9, icon: FiPackage },
  { name: "Account & Profile", count: 7, icon: FiUser },
  { name: "Payments & Offers", count: 5, icon: FiHeart },
  { name: "General", count: 5, icon: FiHelpCircle },
];
const trustItems: { icon: IconType; title: string; detail: string }[] = [
  { icon: FiTruck, title: "Free Shipping", detail: "On orders above ₹1,999" },
  { icon: FiUser, title: "Lab Tested", detail: "Quality you can trust" },
  { icon: FiShield, title: "Secure Payments", detail: "100% safe checkout" },
  { icon: FiRefreshCw, title: "Easy Returns", detail: "Hassle-free returns" },
];

export default function FaqPage() {
  const [category, setCategory] = useState("All Questions");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number[]>([0]);
  const [visible, setVisible] = useState(8);
  const filtered = useMemo(
    () =>
      faqs.filter(
        (faq) =>
          (category === "All Questions" || faq.category === category) &&
          faq.question.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, query],
  );
  const toggle = (index: number) =>
    setOpen((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  const expandAll = () =>
    setOpen(
      open.length === filtered.length ? [] : filtered.map((_, index) => index),
    );

  return (
    <section className="bg-[#fbfcfe] py-7 text-navy">
      <div className="text-[10px] text-slate-soft">
        Home <span className="mx-2">›</span>{" "}
        <span className="text-navy">FAQ</span>
      </div>
      <div className="relative mt-3 overflow-hidden rounded-lg px-1 py-3 sm:min-h-36">
        <div className="relative z-10 max-w-lg">
          <h1 className="text-[28px] font-extrabold tracking-tight sm:text-[32px]">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-xs leading-5 text-slate-soft">
            Find answers to the most common questions about our products,
            <br className="hidden sm:block" /> orders, shipping, returns, and
            more.
          </p>
          <label className="mt-4 flex max-w-xl items-center">
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(8);
              }}
              placeholder="Search FAQs..."
              aria-label="Search FAQs"
              className="h-10 pr-10"
            />
            <FiSearch className="-ml-8 text-navy" />
          </label>
        </div>
        <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[url('/hero-bg.png')] bg-contain bg-right bg-no-repeat opacity-75 sm:block" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[235px_minmax(0,1fr)_235px]">
        <aside className="grid content-start gap-4">
          <div className="rounded-lg border border-line bg-white p-3 shadow-sm">
            <h2 className="px-2 text-xs font-extrabold">Categories</h2>
            <div className="mt-3 grid gap-1">
              {categories.map(({ name, count, icon: Icon }) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => {
                    setCategory(name);
                    setVisible(8);
                  }}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-left text-[10px] ${category === name ? "bg-green-soft font-bold text-green-600" : "hover:bg-gray-50"}`}
                >
                  <Icon size={14} />
                  {name}
                  <span className="ml-auto text-slate-soft">{count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-green-100 bg-[#f4fbf5] p-4 text-center">
            <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-green-soft text-green-600">
              <FiHeadphones size={23} />
            </span>
            <h2 className="mt-3 text-xs font-extrabold">
              Still have questions?
            </h2>
            <p className="mt-1 text-[9px] text-slate-soft">
              Our support team is here to help
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded bg-green-600 px-5 py-2 text-[9px] font-bold text-white"
            >
              Contact Support
            </Link>
          </div>
        </aside>
        <main className="min-w-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-extrabold">
              All Questions{" "}
              <span className="ml-2 font-normal text-green-600">
                {filtered.length} Questions
              </span>
            </h2>
            <button
              type="button"
              onClick={expandAll}
              className="text-[9px] font-bold text-green-600"
            >
              {open.length === filtered.length ? "Collapse All" : "Expand All"}{" "}
              <FiChevronDown className="ml-1 inline" />
            </button>
          </div>
          <div className="grid gap-2">
            {filtered.slice(0, visible).map((faq, index) => (
              <AnimatedAccordionItem
                key={faq.question}
                title={<span className="py-3 text-[10px] font-bold">{faq.question}</span>}
                open={open.includes(index)}
                onToggle={() => toggle(index)}
                className={`rounded-md border px-3 ${open.includes(index) ? "border-green-100 bg-[#f4fbf5]" : "border-line bg-white"}`}
                contentClassName="pb-3 pr-5 text-[9px] leading-4 text-slate-soft"
              >{faq.answer}</AnimatedAccordionItem>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="py-10 text-center text-xs text-slate-soft">
              No questions found. Try another search.
            </p>
          )}
          {visible < filtered.length && (
            <Button
              type="button"
              onClick={() => setVisible((value) => value + 4)}
              variant="outline"
              className="mx-auto mt-5 flex text-[9px]"
            >
              Load More Questions <FiChevronDown />
            </Button>
          )}
        </main>
        <aside className="grid content-start gap-4">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Need More Help?</h2>
            <p className="mt-2 text-[9px] leading-4 text-slate-soft">
              Can&apos;t find the answer you&apos;re looking for? Our support
              team is ready to assist you.
            </p>
            <a
              href="tel:+919876543210"
              className="mt-4 flex items-center gap-2 text-[9px] font-bold"
            >
              <FiPhone className="text-green-600" /> +91 98765 43210
            </a>
            <a
              href="mailto:support@thegrowthhealth.com"
              className="mt-3 flex items-center gap-2 text-[9px] font-bold"
            >
              <FiMail className="text-green-600" /> support@thegrowthhealth.com
            </a>
            <p className="mt-3 flex items-center gap-2 text-[9px]">
              <FiClock className="text-green-600" /> Mon-Sat: 10 AM-7 PM
            </p>
            <Link
              href="/contact"
              className="mt-4 block rounded bg-green-600 py-2 text-center text-[9px] font-bold text-white"
            >
              Contact Support
            </Link>
          </div>
          {[
            [
              FiTruck,
              "Order & Shipping",
              "Track your order, delivery timelines and shipping information.",
              "/shipping-policy",
            ],
            [
              FiRefreshCw,
              "Returns & Refunds",
              "Easy returns within 7 days. Hassle-free refunds.",
              "/returns-refunds",
            ],
            [
              FiPackage,
              "Product Information",
              "Learn more about our ingredients, benefits and usage.",
              "/shop",
            ],
          ].map(([Icon, title, detail, href]) => (
            <Link
              key={title as string}
              href={href as string}
              className="rounded-lg border border-line bg-white p-4 shadow-sm hover:border-green-300"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-green-soft text-green-600">
                <Icon size={16} />
              </span>
              <h2 className="mt-2 text-[10px] font-extrabold">{title}</h2>
              <p className="mt-1 text-[8px] leading-3 text-slate-soft">
                {detail}
              </p>
              <span className="mt-3 block text-[8px] font-bold text-green-600">
                View Details <FiArrowRight className="inline" />
              </span>
            </Link>
          ))}
        </aside>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-line bg-white p-3 sm:grid-cols-4">
        {trustItems.map(({ icon: Icon, title, detail }) => (
          <div
            key={title}
            className="flex items-center gap-2 border-r border-line last:border-0"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-green-soft text-green-600">
              <Icon size={14} />
            </span>
            <span>
              <b className="block text-[8px]">{title}</b>
              <small className="text-[7px] text-slate-soft">{detail}</small>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
