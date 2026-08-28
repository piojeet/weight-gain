"use client";

import Link from "next/link";
import { CiUser } from "react-icons/ci";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { GoHeart } from "react-icons/go";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";
import { useWishlist } from "@/app/hooks/useWishlist";
import { useCart } from "@/app/hooks/useCart";
import ProductSearch from "@/components/search/ProductSearch";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Science", href: "/science-ingredients" },
  { label: "About Us", href: "/about-us" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const ICON_LINKS = [
  { href: "/my-account", icon: CiUser },
  { href: "/wishlist", icon: GoHeart },
  { href: "/cart", icon: HiOutlineShoppingBag },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { productIds } = useWishlist();
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const isRouteActive = (href: string) =>
    href === "/shop" ? pathname === "/shop" || pathname.startsWith("/product") : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  return (
    <header className="relative border-b border-gray-100 bg-white">
      <nav className="container-page flex items-center justify-between gap-2 py-3">
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-xl text-navy hover:bg-blue-50 lg:hidden"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <Logo />

        <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                aria-current={isRouteActive(href) ? "page" : undefined}
                className={`border-b-2 pb-1 transition-colors ${isRouteActive(href) ? "border-[#1a9853] font-bold text-[#1a9853]" : "border-transparent hover:border-[#1a9853] hover:text-[#1a9853]"}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          <ProductSearch className="hidden sm:block" />

          <div className="flex items-center gap-1 sm:gap-2">
            {ICON_LINKS.map(({ href, icon: Icon }) => {
              const count = href === "/wishlist" ? productIds.length : href === "/cart" ? cartCount : 0;
              const isActive = isRouteActive(href);
              return (
              <Link
                key={href}
                href={href}
                aria-label={href === "/my-account" ? "My account" : href.slice(1)}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex size-9 shrink-0 items-center justify-center rounded-full text-lg ${isActive ? "bg-green-soft text-green-600" : "hover:bg-blue-50"}`}
              >
                <Icon />
                {count > 0 && (
                  <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-green-500 text-[9px] font-medium leading-none text-white">
                    {count}
                  </span>
                )}
              </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <div
        id="mobile-navigation"
        style={{ transform: menuOpen ? "translateX(0)" : "translateX(-100%)", opacity: menuOpen ? 1 : 0 }}
        className={`absolute inset-x-0 top-full z-40 border-t border-gray-100 bg-white px-5 py-3 shadow-lg transition-all duration-300 ease-out lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <ul className="grid gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                aria-current={isRouteActive(href) ? "page" : undefined}
                className={`block rounded-md border-l-2 px-3 py-3 text-sm font-semibold ${isRouteActive(href) ? "border-green-600 bg-green-soft text-green-600" : "border-transparent text-navy hover:bg-green-soft hover:text-green-600"}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}