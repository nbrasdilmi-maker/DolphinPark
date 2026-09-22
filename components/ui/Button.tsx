import { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  target,
  rel,
}: ButtonProps) {
  const classes = `btn ${variant} ${className}`;
  if (href) {
    if (href.startsWith("/") && !target) {
      return (
        <Link
          className={classes}
          href={href}
          aria-disabled={disabled ? "true" : undefined}
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        className={classes}
        href={href}
        target={target}
        rel={rel}
        aria-disabled={disabled ? "true" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={classes} type={type} disabled={disabled}>
      {children}
    </button>
  );
}