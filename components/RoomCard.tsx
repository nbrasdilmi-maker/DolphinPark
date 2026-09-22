import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { Users, Check, ArrowLeft } from "@/components/icons";
import { ik } from "@/lib/content";

type RoomCardProps = {
  slug: string;
  src: string;
  alt: string;
  title: string;
  desc: string;
  capacity: number;
  features: string[];
  price: string;
  index?: number;
};

export function RoomCard({
  slug,
  src,
  alt,
  title,
  desc,
  capacity,
  features,
  price,
  index = 0,
}: RoomCardProps) {
  return (
    <Reveal className="revealItem" delay={(index % 3) * 90}>
      <article className="roomCard">
        <div className="roomMedia">
          <Image src={ik(src, 800)} alt={alt} fill sizes="(max-width:760px) 100vw,33vw" />
        </div>
        <div className="roomBody">
          <span className="roomMeta">
            <Users size={14} strokeWidth={1.8} />
            حتى {capacity} أشخاص
          </span>
          <h3>{title}</h3>
          <p>{desc}</p>
          <ul className="roomFeats">
            {features.map((f) => (
              <li key={f}>
                <Check size={13} strokeWidth={2} />
                {f}
              </li>
            ))}
          </ul>
          <div className="roomFoot">
            <div className="roomPrice">
              <b>{price}</b>
              <small>ليلة واحدة</small>
            </div>
            <div className="roomActions">
              <Link className="roomDetails" href={`/rooms/${slug}`}>
                التفاصيل <ArrowLeft size={13} strokeWidth={1.8} />
              </Link>
              <Button variant="primary" href={`/book?room=${encodeURIComponent(slug)}`}>
                احجز
              </Button>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}