"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/nav/Header";
import BottomMobileHeader from "@/components/nav/BottomMobileHeader";
import SearchMobile from "@/components/nav/SearchMobile";
import Footer from "@/components/footer/Footer";
import TopBar from "@/components/nav/TopBar";
import Newsletter from "@/components/newsletter/Newsletter";

const authRoutes = new Set(["/login", "/signup", "/forgot-password"]);

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (authRoutes.has(pathname)) return <main className="flex-1">{children}</main>;

  return <>
    <div>
      <TopBar />
      <Header />
      <div aria-hidden="true" className="h-15 lg:h-17" />
      <SearchMobile />
    </div>
    <main className="flex-1">{children}</main>
    <BottomMobileHeader />
    <Newsletter />
    <Footer />
  </>;
}
