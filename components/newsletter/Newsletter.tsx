"use client";

import { useState } from "react";
import { PiGiftLight, PiLightbulbLight, PiSparkleLight } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerApi } from "@/lib/api/customer";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      setMessage("");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const result = await customerApi.subscribeNewsletter(normalizedEmail);
      setMessage(result.alreadySubscribed ? "This email is already subscribed." : "Thanks for subscribing. Your subscription is confirmed.");
      setEmail("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to subscribe right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-page py-16 pb-0">
      <div className="grid gap-8 rounded-lg border border-line bg-gray-50 p-4 sm:p-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h3 className="font-display text-xl font-extrabold text-navy">
            Stay Updated
          </h3>
          <p className="mt-1 text-sm text-slate-soft">
            Get updates on new products, offers and nutrition tips.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 max-w-sm" aria-busy={loading}>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <Input
                id="newsletter-email"
                type="email"
                required
                maxLength={255}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); setMessage(""); }}
                placeholder="Enter your email"
                className="h-10 min-w-0 flex-1"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "newsletter-error" : message ? "newsletter-status" : undefined}
              />
              <Button
                type="submit"
                className="shrink-0 rounded-lg bg-navy-900 sm:px-5 px-3 sm:py-2.5 py-2 text-sm font-semibold text-white hover:bg-navy-800"
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            <label className="mt-2 flex items-start gap-2 text-xs text-slate-soft">
              <input type="checkbox" required className="mt-0.5 accent-green-600" />
              <span>I agree to receive newsletter updates.</span>
            </label>
          </form>
          {error && <p id="newsletter-error" role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
          {message && <p id="newsletter-status" role="status" className="mt-2 text-sm text-green-700">{message}</p>}
          <p className="mt-2 text-xs text-slate-soft">Unsubscribe support can be added through a secure follow-up flow.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:my-4 lg:border-l lg:border-line lg:pl-6">
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
