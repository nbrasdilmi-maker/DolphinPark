import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/Reveal";
import { ArrowLeft } from "@/components/icons";
export function FeatureCard({
  icon,
  title,
  text,
  index = 0,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  index?: number;
}) {
  return (
    <Reveal className="revealItem" delay={(index % 5) * 80}>
      <Card className="feature" icon={icon} title={title} text={text}>
        <span className="arrow">
          <ArrowLeft size={16} strokeWidth={1.8} />
        </span>
      </Card>
    </Reveal>
  );
}