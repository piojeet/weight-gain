import { FiCheck, FiCreditCard, FiPackage, FiTruck } from "react-icons/fi";

const EVENTS = [
  ["Order Confirmed", "We have received your order.", "18 May 2024", "10:30 AM", FiCheck],
  ["Payment Successful", "Your payment has been confirmed.", "18 May 2024", "10:32 AM", FiCreditCard],
  ["Processing", "Your order is being prepared.", "18 May 2024", "12:15 PM", FiPackage],
  ["Packed", "Your items have been packed securely.", "19 May 2024", "08:45 AM", FiPackage],
  ["Shipped", "Your order has been shipped.", "19 May 2024", "09:20 AM", FiTruck],
  ["Out for delivery", "Your order is out for delivery.", "20 May 2024", "08:45 AM", FiTruck],
  ["Delivered", "Expected by 22 May 2024", "22 May 2024", "By 08:00 PM", FiPackage],
] as const;

export default function ShipmentTimeline() {
  return <section className="rounded-xl border border-line bg-white p-5 sm:p-6"><h2 className="text-sm font-extrabold text-navy">Shipment Timeline</h2><div className="mt-5 grid gap-3">{EVENTS.map(([title, detail, date, time, Icon], index) => <div key={title} className="grid grid-cols-[30px_1fr_auto] items-start gap-3"><div className="relative flex justify-center"><span className={`relative z-10 flex size-7 items-center justify-center rounded-full ${index < 6 ? "bg-green-soft text-green-600" : "bg-gray-100 text-gray-500"}`}><Icon /></span>{index < EVENTS.length - 1 && <span className="absolute top-7 h-8 w-px bg-line" />}</div><div><p className={`text-[11px] font-bold ${index === 5 ? "text-green-600" : "text-navy"}`}>{title}</p><p className="mt-1 text-[10px] text-slate-soft">{detail}</p></div><div className="text-right text-[9px] text-slate-soft"><p>{date}</p><p>{time}</p></div></div>)}</div></section>;
}
