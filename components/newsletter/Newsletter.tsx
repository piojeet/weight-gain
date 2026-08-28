"use client";

import { useState } from "react";
import { PiGiftLight, PiLightbulbLight, PiSparkleLight } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FEATURES = [
  {
    icon: PiGiftLight,
    title: "Exclusive Offers",
    subtitle: "Special discounts for subscribers",
  },
  {
    icon: PiLightbulbLight,
    title: "Nutrition Tips",
    subtitle: "Expert advice & fitness tips",
  },
  {
    icon: PiSparkleLight,
    title: "New Arrivals",
    subtitle: "Be the first to know about new products",
  },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: subscribe logic
  };

  return (
    <section className="container-page py-16 pb-0">
      <div className="grid gap-8 rounded-xl border border-line bg-gray-50 p-4 sm:p-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h3 className="font-display text-xl font-extrabold text-navy">
            Stay Updated
          </h3>
          <p className="mt-1 text-sm text-slate-soft">
            Get updates on new products, offers and nutrition tips.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 flex max-w-md min-w-50 gap-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-10 flex-1 w-full"
            />
            <Button
              type="submit"
              className="shrink-0 rounded-lg bg-navy-900 sm:px-5 px-3 sm:py-2.5 py-2 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Subscribe
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:border-l lg:border-line lg:pl-8">
          {FEATURES.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-start gap-2.5">
              <Icon className="mt-0.5 shrink-0 text-xl text-green-600" />
              <div>
                <p className="text-xs font-semibold text-navy">{title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-soft">
                  {subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
