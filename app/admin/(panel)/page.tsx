import { getDb } from "@/lib/db";

export default async function AdminDashboard() {
  const db = await getDb();
  const [rooms, services, facilities, offers, media, bookings, messages] = await Promise.all([
    db.room.count(),
    db.service.count(),
    db.facility.count(),
    db.offer.count(),
    db.mediaAsset.count(),
    db.bookingRequest.count({ where: { status: "new" } }),
    db.contactMessage.count({ where: { status: "new" } }),
  ]);
  const activity = await db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 });
  const stats: Array<[string, number]> = [
    ["الغرف", rooms],
    ["الخدمات", services],
    ["المرافق", facilities],
    ["العروض", offers],
    ["الوسائط", media],
    ["حجوزات جديدة", bookings],
    ["رسائل جديدة", messages],
  ];
  return (
    <div>
      <h1>لوحة القيادة</h1>
      <div className="adminStats">
        {stats.map(([label, value]) => (
          <div key={label}>
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <h2>النشاط الأخير</h2>
      <ul>
        {activity.map((a) => (
          <li key={a.id}>
            {a.action} — {a.entity} — {a.summary ?? ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
