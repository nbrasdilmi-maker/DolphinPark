import { Waves } from "@/components/Waves";
import { DolphinMotif } from "@/components/DolphinMotif";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  text?: string;
};

export function PageHero({ eyebrow, title, text }: PageHeroProps) {
  return (
    <section className="pageHero">
      <div className="pageHeroShade" />
      <DolphinMotif className="dolphinMotif pageHeroMotif" stroke="#19c6ee" />
      <div className="container pageHeroContent">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {text ? <p>{text}</p> : null}
      </div>
      <Waves className="wave" fill="#ffffff" />
    </section>
  );
}