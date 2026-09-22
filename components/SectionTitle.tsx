import { Reveal } from "@/components/Reveal";
type P = { eyebrow?: string; title: string; text?: string; right?: boolean };
export function SectionTitle({ eyebrow, title, text, right = false }: P) {
  return (
    <Reveal className={`sectionTitle ${right ? "right" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}
