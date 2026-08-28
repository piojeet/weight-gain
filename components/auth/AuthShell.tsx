import Logo from "@/components/nav/Logo";
import { FiCheck, FiClock, FiShield, FiTruck } from "react-icons/fi";

const trustItems = [
  [FiTruck, "Free Shipping", "On orders above ₹1,999"],
  [FiShield, "Lab Tested", "Quality you can trust"],
  [FiCheck, "Secure Payments", "100% safe checkout"],
  [FiClock, "Easy Returns", "Hassle-free returns"],
] as const;

export default function AuthShell({ children, visual = "wellness" }: { children: React.ReactNode; visual?: "wellness" | "secure" }) {
  return <main className="min-h-screen bg-[#f6f8fc] px-3 py-4 sm:px-5 sm:py-6"><div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-270 flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm sm:min-h-[calc(100vh-3rem)]"><div className="flex flex-1 flex-col items-center justify-center px-4 py-7 sm:px-10 sm:py-8"><div className="w-full max-w-81.25 text-center"><div className="flex justify-center"><Logo /></div>{children}</div></div><div className={`hidden h-28 bg-contain bg-bottom bg-no-repeat sm:block ${visual === "wellness" ? "bg-[url('/hero-bg.png')]" : "bg-[url('/hero.png')]"}`} /><div className="grid grid-cols-2 gap-2 border-t border-line bg-[#fbfdfb] px-3 py-2.5 sm:grid-cols-4 sm:px-6">{trustItems.map(([Icon, title, detail]) => <div key={title} className="flex items-center justify-center gap-2 border-r border-line last:border-0"><Icon className="shrink-0 text-green-600" size={15} /><span className="text-left"><b className="block text-[8px] text-navy">{title}</b><small className="text-[7px] text-slate-soft">{detail}</small></span></div>)}</div></div></main>;
}
