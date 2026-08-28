import { IoChevronBack, IoChevronForward } from "react-icons/io5";

function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total];
  if (current >= total - 2) return [1, "...", total - 2, total - 1, total];
  return [1, "...", current, "...", total];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = getPageList(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex size-8 items-center justify-center rounded-full border border-line text-navy hover:bg-gray-50 disabled:opacity-40"
      >
        <IoChevronBack className="text-xs" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-1 text-xs text-slate-soft">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`flex size-8 items-center justify-center rounded-full text-xs font-medium ${
              p === currentPage
                ? "bg-green-500 text-white"
                : "text-navy hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex size-8 items-center justify-center rounded-full border border-line text-navy hover:bg-gray-50 disabled:opacity-40"
      >
        <IoChevronForward className="text-xs" />
      </button>
    </div>
  );
}
