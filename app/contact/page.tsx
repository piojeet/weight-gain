"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiHeart,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiPhone,
  FiSend,
  FiShield,
  FiShoppingBag,
  FiTwitter,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import {
  FaFacebook as FiFacebook,
  FaHeadphones as FiHeadphones,
  FaYoutube as FiYoutube,
} from "react-icons/fa6";
import { PRODUCTS } from "@/app/data/products";
import { useWishlist } from "@/app/hooks/useWishlist";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { AnimatedAccordionItem } from "@/components/ui/faq-tabs-card";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { customerApi } from "@/lib/api/customer";

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const recommendations = [1, 2, 3, 4, 5, 6].flatMap((id) => {
  const product = PRODUCTS.find((item) => item.id === id);
  return product ? [product] : [];
});
const faqs = [
  "How can I track my order?",
  "What is your return and refund policy?",
  "Do you ship internationally?",
  "How can I cancel or modify my order?",
  "Where are your products manufactured?",
];
const trustItems: { icon: IconType; title: string; detail: string }[] = [
  { icon: FiShield, title: "Lab Tested", detail: "Purity & safety" },
  { icon: FiCheck, title: "Clean Ingredients", detail: "No banned substances" },
  { icon: FiShield, title: "100% Authentic", detail: "Genuine products only" },
  {
    icon: FiShoppingBag,
    title: "Secure Payments",
    detail: "100% safe & secure",
  },
  { icon: FiArrowRight, title: "Easy Returns", detail: "Hassle-free returns" },
];

function Channel({
  icon: Icon,
  title,
  value,
  detail,
  href,
}: {
  icon: IconType;
  title: string;
  value: string;
  detail: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 border-r border-line px-4 py-3 last:border-0 hover:bg-green-soft/40 sm:justify-center"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-soft text-green-600">
        <Icon size={18} />
      </span>
      <span>
        <b className="block text-[10px] font-extrabold">{title}</b>
        <strong className="mt-2 block text-[8px] text-green-600">
          {value}
        </strong>
        <small className="mt-1 block text-[8px] text-slate-soft">
          {detail}
        </small>
      </span>
    </a>
  );
}

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { isWishlisted, toggleWishlist } = useWishlist();
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setSubmitting(true);
    setSubmitted(false);
    setSubmitError("");
    try {
      await customerApi.submitContact({
        name: String(values.get("name") ?? ""),
        email: String(values.get("email") ?? ""),
        phone: String(values.get("phone") ?? ""),
        subject: String(values.get("subject") ?? ""),
        order: String(values.get("order") ?? ""),
        message: String(values.get("message") ?? ""),
      });
      form.reset();
      setSubmitted(true);
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Unable to send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-page bg-[#fbfcfe] py-7 text-navy">
      <div className="text-[10px] text-slate-soft">
        Home <span className="mx-2">›</span>{" "}
        <span className="text-navy">Contact Us</span>
      </div>
      <div className="relative mt-3 overflow-hidden rounded-lg">
        <div className="relative z-10 max-w-md py-2 sm:py-4">
          <h1 className="text-[30px] font-extrabold tracking-tight sm:text-[38px]">
            Contact Us
          </h1>
          <p className="mt-2 text-xs leading-5 text-slate-soft">
            We&apos;re here to help! Reach out to us for any queries, support,
            <br className="hidden sm:block" /> or feedback. Our team will get
            back to you as soon as possible.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <FiClock className="text-green-600" />
              <span className="text-[8px]">
                <b className="block text-[9px]">Quick Response</b>Within 24
                hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiUser className="text-green-600" />
              <span className="text-[8px]">
                <b className="block text-[9px]">Expert Support</b>Trained
                Professionals
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiHeart className="text-green-600" />
              <span className="text-[8px]">
                <b className="block text-[9px]">Customer First</b>Your
                Satisfaction Matters
              </span>
            </div>
          </div>
        </div>
        <div className="absolute right-0 top-0 hidden h-full w-1/2 bg-[url('/hero.png')] bg-contain bg-right bg-no-repeat opacity-80 md:block" />
      </div>

      <div className="mt-5 grid overflow-hidden rounded-lg border border-line bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <Channel
          icon={FiPhone}
          title="Call Us"
          value="+91 98765 43210"
          detail="Mon - Sun: 9:00 AM - 7:00 PM"
          href="tel:+919876543210"
        />
        <Channel
          icon={FiMail}
          title="Email Us"
          value="support@thegrowthhealth.com"
          detail="We reply within 24 hours"
          href="mailto:support@thegrowthhealth.com"
        />
        <Channel
          icon={FiMessageCircle}
          title="WhatsApp"
          value="+91 98765 43210"
          detail="Chat with us on WhatsApp"
          href="https://wa.me/919876543210"
        />
        <Channel
          icon={FiMessageCircle}
          title="Live Chat"
          value="Start a live chat"
          detail="Available 9 AM - 7 PM"
          href="#message"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.85fr)]">
        <form
          id="message"
          onSubmit={submit}
          className="rounded-lg border border-line bg-white p-4 shadow-sm"
          aria-busy={submitting}
        >
          <h2 className="text-xs font-extrabold">Send Us a Message</h2>
          <p className="mt-1 text-[9px] text-slate-soft">
            Fill out the form below and we&apos;ll get back to you.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-[8px] font-bold">
              Full Name <span className="text-red-500">*</span>
              <input
                required
                name="name"
                placeholder="Enter your full name"
                className="rounded border border-[#dce3eb] px-2 py-2 text-[9px] font-normal outline-none focus:border-green-500"
              />
            </label>
            <label className="grid gap-1 text-[8px] font-bold">
              Email Address <span className="text-red-500">*</span>
              <input
                required
                type="email"
                name="email"
                placeholder="Enter your email"
                className="rounded border border-[#dce3eb] px-2 py-2 text-[9px] font-normal outline-none focus:border-green-500"
              />
            </label>
            <label className="grid gap-1 text-[8px] font-bold">
              Phone Number
              <input
                name="phone"
                placeholder="Enter your phone number"
                className="rounded border border-[#dce3eb] px-2 py-2 text-[9px] font-normal outline-none focus:border-green-500"
              />
            </label>
            <label className="grid gap-1 text-[8px] font-bold">
              Subject <span className="text-red-500">*</span>
              <AnimatedSelect
                required
                name="subject"
                defaultValue=""
                placeholder="Select a subject"
                size="sm"
                options={[
                  { value: "Order Support", label: "Order Support" },
                  { value: "Product Question", label: "Product Question" },
                  { value: "Returns & Refunds", label: "Returns & Refunds" },
                  { value: "Other", label: "Other" },
                ]}
              />
            </label>
            <label className="grid gap-1 text-[8px] font-bold sm:col-span-2">
              Order Number (Optional)
              <input
                name="order"
                placeholder="Enter your order number"
                className="rounded border border-[#dce3eb] px-2 py-2 text-[9px] font-normal outline-none focus:border-green-500"
              />
            </label>
            <label className="grid gap-1 text-[8px] font-bold sm:col-span-2">
              Message <span className="text-red-500">*</span>
              <textarea
                required
                name="message"
                rows={4}
                placeholder="Type your message here..."
                className="resize-y rounded border border-[#dce3eb] px-2 py-2 text-[9px] font-normal outline-none focus:border-green-500"
              />
            </label>
          </div>
          {submitError && (
            <p role="alert" className="mt-3 text-center text-[9px] font-bold text-red-600">
              {submitError}
            </p>
          )}
          {submitted && (
            <p
              role="status"
              className="mt-3 text-center text-[9px] font-bold text-green-600"
            >
              Thanks for reaching out. We&apos;ll reply within 24 hours.
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mx-auto mt-3 flex w-56 items-center justify-center gap-2 rounded bg-green-600 py-2 text-[9px] font-bold text-white hover:bg-green-700"
          >
            <FiSend /> {submitting ? "Sending..." : "Send Message"}
          </button>
          <p className="mt-3 text-center text-[8px] text-slate-soft">
            <FiShield className="mr-1 inline" />
            Your information is safe with us. We never share your data.
          </p>
        </form>

        <div className="grid gap-4">
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <h2 className="text-xs font-extrabold">Contact Information</h2>
            <p className="mt-1 text-[9px] text-slate-soft">
              Here&apos;s how you can reach us or visit us.
            </p>
            <div className="mt-4 grid gap-4 text-[8px]">
              <div className="flex gap-3">
                <FiMapPin className="mt-1 text-green-600" />
                <p>
                  <b className="block text-[9px]">Registered Office</b>
                  <span className="mt-1 block leading-3 text-slate-soft">
                    TheGrowthHealth Healthcare Pvt. Ltd.
                    <br />
                    123, Wellness Park, Andheri East,
                    <br />
                    Mumbai - 400069, Maharashtra, India
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <FiHeadphones className="mt-1 text-green-600" />
                <p>
                  <b className="block text-[9px]">Customer Support</b>
                  <span className="mt-1 block text-slate-soft">
                    +91 98765 43210
                    <br />
                    support@thegrowthhealth.com
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <FiUsers className="mt-1 text-green-600" />
                <p>
                  <b className="block text-[9px]">Business Enquiries</b>
                  <span className="mt-1 block text-slate-soft">
                    business@thegrowthhealth.com
                  </span>
                </p>
              </div>
              <div className="flex gap-3">
                <FiHeart className="mt-1 text-green-600" />
                <p>
                  <b className="block text-[9px]">Media &amp; Partnerships</b>
                  <span className="mt-1 block text-slate-soft">
                    media@thegrowthhealth.com
                  </span>
                </p>
              </div>
              <div>
                <b className="block text-[9px]">Follow Us</b>
                <div className="mt-2 flex gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-pink-500 text-white">
                    <FiInstagram size={11} />
                  </span>
                  <span className="flex size-5 items-center justify-center rounded-full bg-blue-600 text-white">
                    <FiFacebook size={11} />
                  </span>
                  <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-white">
                    <FiYoutube size={11} />
                  </span>
                  <span className="flex size-5 items-center justify-center rounded-full bg-sky-500 text-white">
                    <FiTwitter size={11} />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-full bg-green-soft text-green-600">
                <FiUsers size={24} />
              </span>
              <div>
                <h2 className="text-xs font-extrabold">Still Need Help?</h2>
                <p className="mt-1 text-[8px] text-slate-soft">
                  Our support team is ready to assist you with anything you
                  need.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("message")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-3 rounded border border-green-500 px-4 py-1.5 text-[9px] font-bold text-green-600"
                >
                  Chat with Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.85fr)]">
        <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-extrabold">
              Frequently Asked Questions
            </h2>
            <Link href="/faq" className="text-[9px] font-bold text-green-600">
              View All FAQs <FiArrowRight className="inline" />
            </Link>
          </div>
          {faqs.map((faq, index) => (
            <AnimatedAccordionItem
              key={faq}
              title={<span className="py-2.5 text-[9px] font-medium">{faq}</span>}
              open={openFaq === index}
              onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              className="border-t border-[#edf0f4]"
              contentClassName="pb-3 pr-6 text-[8px] leading-3 text-slate-soft"
            >
              Our support team can help with this. Please contact us through the form above and include your order details where relevant.
            </AnimatedAccordionItem>
          ))}
        </div>
        <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-green-soft text-green-600">
              <FiUsers size={24} />
            </span>
            <div>
              <h2 className="text-xs font-extrabold">Need Help?</h2>
              <p className="mt-1 text-[8px] text-slate-soft">
                Our support team is ready to assist you with anything you need.
              </p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center text-[8px]">
            <span>
              <FiUser className="mx-auto mb-1 text-green-600" />
              Friendly Support
            </span>
            <span>
              <FiClock className="mx-auto mb-1 text-green-600" />
              Quick Resolution
            </span>
            <span>
              <FiCheck className="mx-auto mb-1 text-green-600" />
              100% Satisfaction
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-extrabold">Recommended for You</h2>
            <p className="mt-1 text-[9px] text-slate-soft">
              Handpicked products you might be interested in
            </p>
          </div>
          <Link href="/shop" className="text-[9px] font-bold text-green-600">
            View All Products <FiArrowRight className="inline" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {recommendations.map((product) => (
            <div
              key={product.id}
              className="relative rounded-md border border-line bg-white p-2 shadow-sm"
            >
              <button
                type="button"
                aria-label={`Wishlist ${product.name}`}
                onClick={() => void toggleWishlist(product.id)}
                className="absolute right-2 top-2 text-slate-soft"
              >
                <FiHeart
                  size={13}
                  fill={isWishlisted(product.id) ? "currentColor" : "none"}
                />
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="mx-auto h-20 object-contain"
              />
              <p className="truncate text-[9px] font-bold">{product.name}</p>
              <p className="mt-1 truncate text-[8px] text-slate-soft">
                {product.description}
              </p>
              <p className="mt-1 text-[10px] font-extrabold">
                {money(product.price)}
              </p>
              <p className="text-[8px] text-slate-soft line-through">
                {money(product.mrp ?? 0)}
              </p>
              <AddToCartButton productId={product.id} className="mt-2 w-full rounded border border-[#bdc8d6] py-1.5 text-[8px] font-bold hover:border-green-500 hover:text-green-600" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-line bg-white p-3 sm:grid-cols-3 lg:grid-cols-5">
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
