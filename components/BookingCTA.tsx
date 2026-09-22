import { DolphinMotif } from "@/components/DolphinMotif";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "@/components/icons";

export function BookingCTA({
  title,
  text,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  title?: string | null;
  text?: string | null;
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
}) {
  return (
    <div className="bookingBox">
      <DolphinMotif className="dolphinMotif bookingMotif" stroke="#19c6ee" />
      <div>
        <h2>{title ?? "جاهزون لقضاء يوم مختلف؟"}</h2>
        <p>
          {text ??
            "احجزوا غرفتكم أو استمتعوا بيوم كامل على البحر، فريقنا جاهز لاستقبالكم وتجهيز كل ما تحتاجونه."}
        </p>
      </div>
      <div className="bookingActions">
        <Button variant="primary" href={primaryHref ?? "/book"}>
          {primaryLabel ?? "احجز مكانك"} <ArrowLeft size={16} strokeWidth={2} />
        </Button>
        <Link className="bookingLink" href={secondaryHref ?? "/rooms"}>
          {secondaryLabel ?? "تصفح الغرف"}
        </Link>
      </div>
    </div>
  );
}