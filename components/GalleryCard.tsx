import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Play } from "@/components/icons";
import { ik } from "@/lib/content";
export function GalleryCard({
  src,
  alt,
  label,
  index = 0,
  video = false,
}: {
  src: string;
  alt: string;
  label: string;
  index?: number;
  video?: boolean;
}) {
  return (
    <Reveal className="revealItem" delay={index * 90}>
      <article className="galleryCard">
        <Image src={ik(src, 800)} alt={alt} fill sizes="(max-width:760px) 100vw,33vw" />
        <div className="galleryShade" />
        {video && (
          <span className="play">
            <Play size={22} strokeWidth={2} fill="currentColor" />
          </span>
        )}
        <b>{label}</b>
      </article>
    </Reveal>
  );
}