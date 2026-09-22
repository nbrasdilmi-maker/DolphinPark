"use client";
import { FormEvent, useState } from "react";
import { DolphinMotif } from "@/components/DolphinMotif";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";
import {
  Phone,
  Mail,
  ArrowLeft,
  Check,
  WhatsApp,
  Instagram,
  Facebook,
  Youtube,
  TikTok,
} from "@/components/icons";

export function ContactSection({
  phone,
  email,
  social,
}: {
  phone?: string;
  email?: string;
  social?: {
    whatsapp: string;
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
}) {
  const displayPhone = phone ?? siteConfig.contact.phone;
  const displayEmail = email ?? siteConfig.contact.email;
  const displaySocial = social ?? siteConfig.social;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [subject, setSubject] = useState("حجز");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phoneInput, subject, message }),
      });
      if (!res.ok) throw new Error("send");
      setSent(true);
    } catch {
      setError("تعذر إرسال الطلب. حاول مرة أخرى.");
      setBusy(false);
    }
  }

  return (
    <section className="contact" id="contact">
      <DolphinMotif
        className="dolphinMotif contactMotif"
        stroke="rgba(25,198,238,0.9)"
      />
      <div className="container contactGrid">
        <Reveal className="aboutReveal" delay={0}>
          <div className="contactCopy">
            <span className="eyebrow">تواصل معنا واحجز الآن</span>
            <h2>
              جاهز ليوم جميل
              <br />
              <em>على البحر؟</em>
            </h2>
            <p>
              اترك بياناتك وسنتواصل معك لتأكيد الحجز وتزويدك بالتفاصيل
              اللازمة.
            </p>
            <div className="contactInfo">
              <div>
                <Phone size={16} strokeWidth={1.8} />
                <span>
                  <small>اتصل بنا</small>
                  <b dir="ltr">{displayPhone}</b>
                </span>
              </div>
              <div>
                <Mail size={16} strokeWidth={1.8} />
                <span>
                  <small>البريد الإلكتروني</small>
                  <b>{displayEmail}</b>
                </span>
              </div>
            </div>
            <div className="social contactSocials">
              <a
                href={displaySocial.whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label="تواصل عبر واتساب"
              >
                <WhatsApp size={17} />
              </a>
              <a
                href={displaySocial.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="تابعنا على إنستغرام"
              >
                <Instagram size={17} strokeWidth={1.8} />
              </a>
              <a
                href={displaySocial.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="تابعنا على فيسبوك"
              >
                <Facebook size={17} strokeWidth={1.8} />
              </a>
              <a
                href={displaySocial.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="شاهدنا على يوتيوب"
              >
                <Youtube size={17} strokeWidth={1.8} />
              </a>
              <a
                href={displaySocial.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="تابعنا على تيك توك"
              >
                <TikTok size={17} strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </Reveal>
        <Reveal className="aboutReveal" delay={120}>
          <form className="form" onSubmit={submit}>
            <div className="formRow">
              <label>
                الاسم الكامل
                <input required placeholder="اكتب اسمك" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                رقم الهاتف
                <input required placeholder="رقم الهاتف" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} />
              </label>
            </div>
            <label>
              نوع الطلب
              <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                <option>حجز</option>
                <option>استفسار</option>
                <option>خدمة</option>
                <option>أخرى</option>
              </select>
            </label>
            <label>
              رسالتك
              <textarea rows={5} placeholder="اكتب تفاصيل طلبك..." value={message} onChange={(e) => setMessage(e.target.value)} />
            </label>
            {error ? <p role="alert">{error}</p> : null}
            <Button variant="primary" type="submit" disabled={busy || sent}>
              {sent ? (
                <>
                  تم إرسال الطلب <Check size={16} strokeWidth={2} />
                </>
              ) : (
                <>
                  إرسال الطلب <ArrowLeft size={16} strokeWidth={2} />
                </>
              )}
            </Button>
            <small className="note">
              * سيتواصل معكم فريق المنتزه بعد استلام طلبكم.
            </small>
          </form>
        </Reveal>
      </div>
    </section>
  );
}