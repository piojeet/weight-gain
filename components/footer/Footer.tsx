import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaXTwitter,
  FaFlask,
  FaShieldHalved,
  FaFlag,
} from "react-icons/fa6";
import Logo from "../nav/Logo";
import Visa from "@/public/payment-recived/visa.jpg";
import Mastercard from "@/public/payment-recived/mastercard.jpg";
import Rupay from "@/public/payment-recived/rupay.jpg";
import UPI from "@/public/payment-recived/upi.png";
import Image from "next/image";

const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Weight Gainers", href: "/shop?category=mass-builders" },
      { label: "Mass Builders", href: "/shop?category=mass-builders" },
      { label: "Proteins", href: "/shop?category=protein" },
      { label: "Nutrition Essentials", href: "/shop?category=nutrition-essentials" },
      { label: "Accessories", href: "/shop?category=accessories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Our Science", href: "/science-ingredients" },
      { label: "Blog", href: "/blog" },
      { label: "Reviews", href: "/my-account/reviews" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Returns & Refunds", href: "/returns-refunds" },
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/order-tracking" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com/", icon: FaInstagram },
  { label: "Email", href: "mailto:support@thegrowthhealth.com", icon: FaEnvelope },
  { label: "X", href: "https://x.com/", icon: FaXTwitter },
];

const BADGES = [
  { label: "Lab Tested", icon: FaFlask },
  { label: "GMP Certified", icon: FaShieldHalved },
  { label: "Made in India", icon: FaFlag },
];

const PAYMENT_METHODS = [
  { name: "Visa", src: Visa },
  { name: "Mastercard", src: Mastercard },
  { name: "RuPay", src: Rupay },
  { name: "UPI", src: UPI },
];

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300 pb-16 lg:pb-0">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="col-span-2 space-y-4 lg:col-span-1">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-gray-400">
            Premium nutrition products backed by science to help you build a
            stronger, healthier you.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-sm hover:bg-green-500"
              >
                <Icon />
              </Link>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map(({ title, links }) => (
          <div key={title}>
            <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 sm:col-span-1">
          <h4 className="mb-4 text-sm font-semibold text-white">We Accept</h4>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map(({ name, src }) => (
              <span
                key={name}
                className="flex h-7 w-11 items-center justify-center gap-4 rounded-md bg-white px-1"
              >
                <Image
                  src={src}
                  alt={name}
                  width={40}
                  height={20}
                  className="h-full w-auto object-contain"
                />
              </span>
            ))}
          </div>
          <p className="mt-5 flex items-center gap-1 text-xs font-semibold text-white">
            <span aria-hidden="true">🔒</span> 100% Secure Payments
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Your payments are safe with us.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center gap-3 py-5 text-xs text-gray-400 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} TheGrowthHealth. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {BADGES.map(({ label, icon: Icon }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="text-green-500" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
