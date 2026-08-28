import { FiCheck, FiPackage, FiTruck, FiUser } from "react-icons/fi";

const STATUS = [
  ["Confirmed", "18 May, 10:30 AM", FiCheck],
  ["Processing", "18 May, 12:15 PM", FiPackage],
  ["Shipped", "19 May, 09:20 AM", FiTruck],
  ["Out for Delivery", "20 May, 08:45 AM", FiUser],
  ["Delivered", "Expected by 22 May", FiPackage],
] as const;

export default function TrackingStatus() {
  return <div className="grid grid-cols-5 gap-1">{STATUS.map(([title, date, Icon], index) => <div key={title} className="relative text-center">{index < STATUS.length - 1 && <div className={`absolute left-1/2 top-5 hidden h-0.5 w-full sm:block ${index < 3 ? "bg-green-600" : "bg-line"}`} />}<span className={`relative z-10 mx-auto flex size-10 items-center justify-center rounded-full border-2 bg-white ${index < 4 ? "border-green-600 text-green-600" : "border-gray-300 text-gray-400"}`}><Icon /></span><p className="mt-2 text-[9px] font-bold text-navy sm:text-[10px]">{title}</p><p className="mt-1 text-[8px] text-slate-soft sm:text-[9px]">{date}</p></div>)}</div>;
}
