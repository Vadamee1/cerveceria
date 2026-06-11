import { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-white">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`w-full rounded-lg border bg-black px-3 py-2 text-white outline-none placeholder:text-gray-500 focus:ring-1 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-white/30 focus:border-white focus:ring-white"
        } ${className ?? ""}`}
        {...props}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
