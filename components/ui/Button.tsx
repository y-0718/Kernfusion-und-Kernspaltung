import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-[#0033A0] text-white hover:bg-[#062a7a]",
    secondary: "border border-[#0033A0]/15 bg-white text-[#0033A0] hover:bg-[#EEF4FF]",
    ghost: "text-[#0033A0] hover:bg-[#EEF4FF]",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
