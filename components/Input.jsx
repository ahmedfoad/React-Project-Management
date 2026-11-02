export default function Input({ label, textarea, className = "", ...props }) {
  const inputId =
    props.id || props.name || label.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-[#344b40]"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          {...props}
          id={inputId}
          className={`block w-full resize-y rounded-xl border border-[#dfe6e1] bg-white px-3.5 py-3 text-sm text-[#18372e] outline-none transition placeholder:text-[#a0aaa4] focus:border-[#4b8a70] focus:ring-4 focus:ring-[#4b8a70]/10 ${className}`}
        />
      ) : (
        <input
          {...props}
          id={inputId}
          className={`block h-11 w-full rounded-xl border border-[#dfe6e1] bg-white px-3.5 text-sm text-[#18372e] outline-none transition placeholder:text-[#a0aaa4] focus:border-[#4b8a70] focus:ring-4 focus:ring-[#4b8a70]/10 ${className}`}
        />
      )}
    </div>
  );
}
