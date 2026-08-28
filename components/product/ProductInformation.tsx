"use client";

import { FiCheckCircle, FiChevronDown, FiShield, FiTruck } from "react-icons/fi";
import { useState } from "react";
import type { Product } from "@/app/types/shop";

const TABS = ["Description", "Ingredients", "Nutrition Facts", "How to Use", "FAQ"] as const;
type ActiveTab = (typeof TABS)[number];

export default function ProductInformation({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<ActiveTab | null>("Description");
  const details = product.details;

  const toggleTab = (tab: ActiveTab) => {
    setActiveTab((currentTab) => (currentTab === tab ? null : tab));
  };

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-white">
      <QualitySection />

      <div className="hidden border-b border-line px-5 sm:flex sm:flex-row sm:gap-7 sm:overflow-x-auto sm:px-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-expanded={activeTab === tab}
            className={`flex w-full items-center justify-between border-b py-4 text-left text-xs font-semibold transition-colors sm:w-auto sm:justify-start sm:border-b-2 ${activeTab === tab ? "border-green-500 text-green-600" : "border-line text-slate-soft hover:text-navy sm:border-transparent"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="hidden sm:block">
        <TabContent activeTab={activeTab ?? "Description"} product={product} details={details} />
      </div>

      <div className="sm:hidden">
        {TABS.map((tab) => (
          <div key={tab} className="border-b border-line last:border-b-0">
            <button
              type="button"
              onClick={() => toggleTab(tab)}
              aria-expanded={activeTab === tab}
              className={`flex w-full items-center justify-between px-5 py-4 text-left text-xs font-semibold ${activeTab === tab ? "text-green-600" : "text-navy"}`}
            >
              {tab}
              <FiChevronDown className={`transition-transform ${activeTab === tab ? "rotate-180" : ""}`} />
            </button>
            {activeTab === tab && <TabContent activeTab={tab} product={product} details={details} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function QualitySection() {
  return (
    <div className="border-b border-line bg-linear-to-r from-[#f4faf8] to-white p-5 sm:p-8">
      <h2 className="text-base font-extrabold text-navy">Quality You Can Trust</h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-4 sm:gap-6">
        {[['Lab Tested', 'For purity & safety'], ['GMP Certified', 'Quality you can trust'], ['Secure Payments', '100% safe checkout'], ['Fast & Reliable', 'Pan India delivery']].map(([title, detail]) => (
          <div key={title} className="flex items-start gap-3 sm:border-r sm:border-line sm:last:border-0"><FiTruck className="mt-0.5 shrink-0 text-green-600" /><div><p className="text-xs font-bold text-navy">{title}</p><p className="mt-1 text-[10px] text-slate-soft">{detail}</p></div></div>
        ))}
      </div>
    </div>
  );
}

function TabContent({
  activeTab,
  product,
  details,
}: {
  activeTab: ActiveTab;
  product: Product;
  details: Product["details"];
}) {
  if (activeTab === "Description") {
    return (
      <div id="details" className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="text-sm font-bold text-navy">Product Overview</h2>
          <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-soft">{details.overview}</p>
          <h3 className="mt-6 text-xs font-bold text-navy">Benefits</h3>
          <ul className="mt-3 grid gap-2 text-xs text-slate-soft sm:grid-cols-2">
            {details.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2"><FiCheckCircle className="shrink-0 text-green-500" />{benefit}</li>)}
          </ul>
        </div>
        <FeatureList features={details.features} />
      </div>
    );
  }

  if (activeTab === "Ingredients") return <ListContent title="Ingredients" items={details.ingredients} />;
  if (activeTab === "How to Use") return <ListContent title="How to Use" items={details.usage} ordered />;
  if (activeTab === "Nutrition Facts") return <ListContent title="Nutrition Facts" items={product.stats.map((stat) => `${stat.label}: ${stat.value}`)} />;
  return <FaqContent faqs={details.faqs} />;
}

function FeatureList({ features }: { features: string[] }) {
  return <div className="grid gap-3 rounded-xl bg-[#f4f8fc] p-5 text-xs text-navy">{features.map((feature) => <p key={feature} className="flex items-center gap-3"><FiShield className="text-blue-400" />{feature}</p>)}</div>;
}

function ListContent({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return <div className="min-h-40 p-5 sm:p-8"><h2 className="text-sm font-bold text-navy">{title}</h2><List className="mt-4 grid gap-3 text-xs leading-5 text-slate-soft">{items.map((item) => <li key={item} className={ordered ? "list-inside list-decimal" : "flex items-center gap-2"}>{!ordered && <FiCheckCircle className="shrink-0 text-green-500" />}{item}</li>)}</List></div>;
}

function FaqContent({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return <div className="min-h-40 p-5 sm:p-8"><h2 className="text-sm font-bold text-navy">Frequently Asked Questions</h2><div className="mt-4 grid gap-2">{faqs.map((faq) => <details key={faq.question} className="rounded-lg border border-line px-4 py-3 text-xs text-navy"><summary className="cursor-pointer font-semibold">{faq.question}</summary><p className="mt-2 leading-5 text-slate-soft">{faq.answer}</p></details>)}</div></div>;
}
