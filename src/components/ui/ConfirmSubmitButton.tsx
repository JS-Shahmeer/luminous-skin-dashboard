"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ConfirmSubmitButton({
  confirmMessage,
  className,
  children,
  ...props
}: {
  confirmMessage: string;
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      className={cn("text-beige transition-colors hover:text-rust", className)}
      {...props}
    >
      {children}
    </button>
  );
}
