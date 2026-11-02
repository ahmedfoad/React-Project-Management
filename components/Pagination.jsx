export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-5 flex items-center justify-center gap-3"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="h-9 rounded-lg border border-[#dfe6e1] bg-white px-3 text-sm font-medium text-[#315d49] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-[#718078]">
        Page {page} of {pageCount}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        className="h-9 rounded-lg border border-[#dfe6e1] bg-white px-3 text-sm font-medium text-[#315d49] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
