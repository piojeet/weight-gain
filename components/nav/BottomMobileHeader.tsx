"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoHome, IoHomeOutline } from "react-icons/io5";
import { BsGrid, BsGrid1X2 } from "react-icons/bs";
import { HiShoppingCart, HiOutlineShoppingCart } from "react-icons/hi2";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoPerson, IoPersonOutline } from "react-icons/io5";
import { useWishlist } from "@/app/hooks/useWishlist";
import { useCart } from "@/app/hooks/useCart";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: IoHomeOutline, activeIcon: IoHome },
  {
    label: "Categories",
    href: "/shop",
    icon: BsGrid1X2,
    activeIcon: BsGrid,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: HiOutlineShoppingCart,
    activeIcon: HiShoppingCart,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: GoHeart,
    activeIcon: GoHeartFill,
  },
  {
    label: "Account",
    href: "/my-account",
    icon: IoPersonOutline,
    activeIcon: IoPerson,
  },
];
export default function BottomMobileHeader() {
  const pathname = usePathname();
  const { productIds } = useWishlist();
  const { items } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white pb-safe lg:hidden">
      <ul className="flex items-center justify-between px-2">
        {NAV_ITEMS.map(
          ({ label, href, icon: Icon, activeIcon: ActiveIcon }) => {
            const isActive = href === "/my-account" ? pathname.startsWith("/my-account") : pathname === href;
            const IconToShow = isActive ? ActiveIcon : Icon;
            const count = href === "/wishlist" ? productIds.length : href === "/cart" ? cartCount : 0;

            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className={`relative flex flex-col items-center gap-1 py-3 text-[11px] font-medium ${
                    isActive ? "text-[#1a9853]" : "text-navy"
                  }`}
                >
                  <span className="relative text-xl">
                    <IconToShow />
                    {count > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-green-500 text-[9px] font-semibold text-white">
                        {count}
                      </span>
                    )}
                  </span>
                  {label}
                </Link>
              </li>
            );
          },
        )}
      </ul>
    </nav>
  );
}
