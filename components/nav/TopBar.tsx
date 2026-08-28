import { PiTruckLight } from "react-icons/pi";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { HiOutlinePhone } from "react-icons/hi2";

const TRUST_BADGES = ["Lab Tested", "Clean Ingredients", "Safe & Trusted"];

export default function TopBar() {
  return (
    <div className="hidden bg-navy-900 text-white lg:block">
      <div className="container-page flex items-center justify-between py-2 text-xs">
        <p className="flex items-center gap-1.5">
          <PiTruckLight className="text-sm text-green-500" />
          Free Shipping on orders above ₹1,999
        </p>

        <div className="flex items-center gap-4 text-gray-300">
          {TRUST_BADGES.map((badge, i) => (
            <span key={badge} className="flex items-center gap-1.5">
              <IoCheckmarkCircleOutline className="text-green-500" />
              {badge}
              {i < TRUST_BADGES.length - 1 && (
                <span className="ml-4 text-gray-600">•</span>
              )}
            </span>
          ))}
        </div>

        <p className="flex items-center gap-1.5">
          <span className="text-gray-300">Need Help?</span>
          <a href="tel:+919876543210" className="flex items-center gap-1 font-semibold hover:text-green-500">
            <HiOutlinePhone />
            +91 98765 43210
          </a>
        </p>
      </div>
    </div>
  );
}