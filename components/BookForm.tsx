"use client";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/SectionTitle";
import { siteConfig } from "@/lib/site";
import { Check, ArrowLeft, Phone, Mail } from "@/components/icons";

const FALLBACK_ROOMS = ["غرفة عائلية", "جناح دولفين", "غرفة مزدوجة"];

export function BookForm({
  phone,
  email,
  rooms,
}: {
  phone?: string;
  email?: string;
  rooms?: Array<{ slug: string; name: string }>;
}) {
  const displayPhone = phone ?? siteConfig.contact.phone;
  const displayEmail = email ?? siteConfig.contact.email;
  const options = rooms && rooms.length > 0 ? rooms : FALLBACK_ROOMS.map((n) => ({ slug: n, name: n }));
  const params = useSearchParams();
  const initial = options.find((r) => r.slug === params.get("room"))?.name ?? options[0].name;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [room, setRoom] = useState(initial);
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState("");
  const [nights, setNights] = useState("1");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phoneInput,
          type: room,
          guests: Number(guests),
          date,
          message: `عدد الليالي: ${nights}`,
        }),
      });
      if (!res.ok) throw new Error("send");
      setSent(true);
    } catch {
      setError("تعذر إرسال الطلب. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  return (
    <div className="container bookGrid">
      <Reveal className="aboutReveal" delay={0}>
        <div className="bookCopy">
          <SectionTitle
            eyebrow="لماذا الحجز مبكرًا؟"
            title="تأكدوا من مكانكم على البحر"
            text="خيارات الغرف محدودة ولا سيما في نهاية الأسبوع، لذا ننصح بالحجز المسبق لضمان أفضل الخيارات والأسعار."
            right
          />
          <div className="locInfo">
            <div>
              <Phone size={18} strokeWidth={1.8} />
              <span>
                <b>الهاتف</b>
                <small dir="ltr">{displayPhone}</small>
              </span>
            </div>
            <div>
              <Mail size={18} strokeWidth={1.8} />
              <span>
                <b>البريد الإلكتروني</b>
                <small>{displayEmail}</small>
              </span>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal className="aboutReveal" delay={120}>
        <form className="form" onSubmit={submit}>
          <h3>طلب حجز</h3>
          <div className="formRow">
            <label>
              الاسم الكامل
              <input required placeholder="اكتب اسمك" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              رقم الهاتف
              <input required dir="ltr" placeholder="رقم الهاتف" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />
            </label>
          </div>
          <div className="formRow">
            <label>
              الغرفة
              <select value={room} onChange={(e) => setRoom(e.target.value)}>
                {options.map((r) => (
                  <option key={r.slug} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              عدد الضيوف
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </label>
          </div>
          <div className="formRow">
            <label>
              تاريخ الوصول
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              عدد الليالي
              <input type="number" min={1} required value={nights} onChange={(e) => setNights(e.target.value)} />
            </label>
          </div>
          {error ? <p role="alert">{error}</p> : null}
          {sent ? (
            <div className="bookOk">
              <Check size={20} strokeWidth={2} />
              <p>تم استلام طلب الحجز وسنتواصل معكم قريبًا لتأكيده.</p>
            </div>
          ) : (
            <Button variant="primary" type="submit" disabled={busy}>
              تأكيد طلب الحجز <ArrowLeft size={16} strokeWidth={2} />
            </Button>
          )}
          <small className="note">
            * الحجز يُؤكد من قبل إدارة المنتزه عبر الهاتف أو البريد.
          </small>
        </form>
      </Reveal>
    </div>
  );
}