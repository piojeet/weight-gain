import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href={"/"} className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold leading-none">
          <span className="text-black">Nutri</span>
          <span className="text-green-500">Gain</span>
        </span>
        <span className="uppercase text-[10px] leading-none">SCIENCE • NUTRITION • RESULTS</span>
      </Link>
    </div>
  );
}
