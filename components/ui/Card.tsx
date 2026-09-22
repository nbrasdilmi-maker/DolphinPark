import { ReactNode } from "react";

type CardProps = {
  className?: string;
  icon?: ReactNode;
  title?: string;
  text?: string;
  children?: ReactNode;
};

export function Card({ className, icon, title, text, children }: CardProps) {
  return (
    <article className={`card ${className ?? ""}`}>
      {icon && <span className="featureIcon">{icon}</span>}
      {title && <h3>{title}</h3>}
      {text && <p>{text}</p>}
      {children}
    </article>
  );
}