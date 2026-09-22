import bcrypt from "bcryptjs";

const provider = process.env.DB_PROVIDER === "postgres" ? "postgres" : "sqlserver";
const mod =
  provider === "postgres"
    ? await import("../generated/prisma-postgres/index.js")
    : await import("../generated/prisma-sqlserver/index.js");
const db = new mod.PrismaClient();

const seedPassword = process.env.ADMIN_SEED_PASSWORD;
if (!seedPassword || seedPassword.length < 8) {
  throw new Error("ADMIN_SEED_PASSWORD must be set (min 8 chars)");
}

const U = "https://images.unsplash.com";

await db.adminUser.upsert({
  where: { username: "admin" },
  update: {},
  create: {
    username: "admin",
    passwordHash: await bcrypt.hash(seedPassword, 12),
    name: "مدير الموقع",
    role: "superadmin",
  },
});

const rooms = [
  {
    slug: "family-room",
    name: "غرفة عائلية",
    shortDesc: "مساحة واسعة تناسب العائلات بإطلالة هادئة ومرافق مريحة.",
    longDesc: "مساحة واسعة تناسب العائلات بإطلالة هادئة ومرافق مريحة.",
    capacity: 5,
    beds: 2,
    features: ["سرير مزدوج", "شبكة واي فاي", "حمام خاص"],
    price: "45,000 ريال",
    cover: `${U}/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85`,
  },
  {
    slug: "dolphin-suite",
    name: "جناح دولفين",
    shortDesc: "جناح مميز بإطلالة بحرية وتجهيزات راقية لقضاء إقامة خاصة.",
    longDesc: "جناح مميز بإطلالة بحرية وتجهيزات راقية لقضاء إقامة خاصة.",
    capacity: 4,
    beds: 2,
    features: ["إطلالة بحر", "غرفة جلوس", "خدمة الغرفة"],
    price: "75,000 ريال",
    cover: `${U}/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85`,
  },
  {
    slug: "double-room",
    name: "غرفة مزدوجة",
    shortDesc: "خيار مريح واقتصادي للأزواج مع كل أساسيات الإقامة.",
    longDesc: "خيار مريح واقتصادي للأزواج مع كل أساسيات الإقامة.",
    capacity: 2,
    beds: 1,
    features: ["سرير زوجي", "تلفاز", "تكييف"],
    price: "28,000 ريال",
    cover: `${U}/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85`,
  },
];

for (const [i, r] of rooms.entries()) {
  await db.room.upsert({
    where: { slug: r.slug },
    update: {},
    create: {
      slug: r.slug,
      name: r.name,
      shortDesc: r.shortDesc,
      longDesc: r.longDesc,
      capacity: r.capacity,
      beds: r.beds,
      featuresJson: JSON.stringify(r.features),
      price: r.price,
      currency: "ر.ي",
      coverUrl: r.cover,
      status: "published",
      sortOrder: i,
    },
  });
}

const services = [
  ["restaurant", "مطعم المنتزه", "أطباق متنوعة وأجواء مريحة على البحر.", "utensils"],
  ["cafe", "كافتيريا وبوفيه", "مشروبات ووجبات خفيفة طوال اليوم.", "coffee"],
  ["grocery", "بقالة ولوازم الشاطئ", "كل ما يحتاجه الزائر في مكان واحد.", "shopping-basket"],
  ["shisha", "جلسات شيشة", "جلسات مريحة بإطلالة على أجواء الكورنيش.", "sofa"],
  ["beach-chairs", "كراسي ومظلات بحرية", "مناطق ظل وجلوس مباشرة على الشاطئ.", "umbrella"],
  ["tents", "خيام استراحة", "خيام خاصة للراحة والخصوصية.", "tent"],
  ["trips", "رحلات بحرية وأنشطة", "جولات وأنشطة تزيد المتعة على الماء.", "sailboat"],
  ["future", "خدمات مستقبلية", "خطط دائمًا لتطوير تجربة الزوار بمزيد من الخيارات.", "bike"],
];

for (const [i, s] of services.entries()) {
  await db.service.upsert({
    where: { slug: s[0] },
    update: {},
    create: { slug: s[0], name: s[1], desc: s[2], iconKey: s[3], status: "published", sortOrder: i },
  });
}

const facilities = [
  ["العائلات", "أجواء مريحة ومساحات مناسبة لقضاء يوم جميل مع العائلة.", "users"],
  ["التصوير التذكاري", "زوايا بحرية جميلة لصناعة صور وذكريات تستحق الاحتفاظ بها.", "camera"],
  ["المطاعم والمقاهي", "خيارات متنوعة للطعام والمشروبات خلال زيارتكم للمنتزه.", "utensils"],
  ["الألعاب الترفيهية", "مساحات وأنشطة ترفيهية تضيف المزيد من المتعة لكل أفراد الأسرة.", "ferris-wheel"],
  ["المسبح", "مساحة مائية للترفيه والاسترخاء ضمن مرافق المنتزه.", "waves"],
];

for (const [i, f] of facilities.entries()) {
  const existing = await db.facility.findFirst({ where: { title: f[0] } });
  if (!existing) {
    await db.facility.create({ data: { title: f[0], text: f[1], iconKey: f[2], status: "published", sortOrder: i } });
  }
}

const offers = [
  ["weekend", "عرض نهاية الأسبوع", "قضاء نهاية أسبوع مريحة مع خصم خاص على الإقامة.", "خصم 20%", "ticket"],
  ["family", "عرض العائلة الممتدة", "للعائلات الكبيرة: حجوزات موسّعة بأسعار أفضل.", "خصم 25%", "users"],
  ["winter", "عرض الشتاء الدافئ", "خيام وجلسات بأجواء دافئة بدأ من نص السعر.", "خصم 30%", "snowflake"],
];

for (const [i, o] of offers.entries()) {
  await db.offer.upsert({
    where: { slug: o[0] },
    update: {},
    create: {
      slug: o[0],
      name: o[1],
      title: o[1],
      desc: o[2],
      badge: o[3],
      iconKey: o[4],
      ctaLabel: "احجز العرض",
      ctaHref: "/book",
      status: "published",
      sortOrder: i,
    },
  });
}

const album = await db.galleryAlbum.upsert({
  where: { slug: "main" },
  update: {},
  create: { slug: "main", name: "المعرض الرئيسي", status: "published", sortOrder: 0 },
});

const gallery = [
  ["g1", "أجواء البحر", false],
  ["g2", "وقت العائلة", false],
  ["g3", "لحظات لا تُنسى", true],
  ["g4", "كراسي الشاطئ", false],
  ["g5", "الإقامة", false],
  ["g6", "الأنشطة", false],
  ["g7", "الغروب", false],
  ["g8", "الجلوس", false],
  ["g9", "الاسترخاء", false],
];
const gurls = {
  g1: `${U}/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=85`,
  g2: `${U}/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85`,
  g3: `${U}/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85`,
  g4: `${U}/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=85`,
  g5: `${U}/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85`,
  g6: `${U}/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85`,
  g7: `${U}/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=85`,
  g8: `${U}/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85`,
  g9: `${U}/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=1000&q=85`,
};

for (const [i, g] of gallery.entries()) {
  const existing = await db.galleryItem.findFirst({ where: { albumId: album.id, mediaUrl: gurls[g[0]] } });
  if (!existing) {
    await db.galleryItem.create({
      data: { albumId: album.id, mediaUrl: gurls[g[0]], caption: g[1], isVideo: g[2], sortOrder: i },
    });
  }
}

const sections = [
  {
    key: "hero",
    eyebrow: "الحُديدة • كورنيش البحر",
    title: "منتزه خليج الدولفين",
    text: "مكان يجمع البحر والعائلة والترفيه في تجربة واحدة مليئة بالذكريات الجميلة.",
    sortOrder: 0,
    config: {
      bgImage: `${U}/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85`,
      primaryBtn: { label: "اكتشف المنتزه", href: "#rooms" },
      secondaryBtn: { label: "احجز تجربتك", href: "/book" },
    },
  },
  {
    key: "about",
    eyebrow: "عن المنتزه",
    title: "مكانك لقضاء يوم مختلف",
    text: "منتزه خليج الدولفين هو وجهة ترفيهية عائلية على ساحل الحديدة، صُممت لتجمع الاسترخاء والأنشطة والخدمات في تجربة واحدة.",
    sortOrder: 1,
    config: {
      image: `${U}/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85`,
      button: { label: "معرفة المزيد", href: "/about" },
      paragraphs: [
        "نؤمن أن اليوم الجميل يبدأ من التفاصيل: إطلالة هادئة، خدمة واضحة، وخيارات تناسب الجميع من جلسات قصيرة إلى إقامات أطول.",
        "موقعنا على كورنيش الحديدة يضعنا في قلب المشهد البحري، مع فريق يعمل دائمًا على تحسين تجربة الزوار وتجهيز مرافق جديدة.",
      ],
    },
  },
  { key: "rooms", eyebrow: "الغرف والإقامات", title: "استمتع بإقامة مريحة على البحر", text: "غرف وجناحات مجهزة بعناية لتناسب العائلات والأفراد.", sortOrder: 2, config: { count: 3 } },
  { key: "services", eyebrow: "الخدمات والأقسام", title: "كل التفاصيل في مكان واحد", text: "خدمات متنوعة صُممت لتجعل زيارتكم مريحة وممتعة.", sortOrder: 3, config: { count: 8 } },
  { key: "facilities", eyebrow: "المرافق والأنشطة", title: "كل ما تحتاجه ليوم ممتع", text: "اكتشف مجموعة من المرافق والخدمات المصممة لتجعل زيارتك أكثر راحة ومتعة.", sortOrder: 4, config: {} },
  {
    key: "why",
    eyebrow: "لماذا تزورنا؟",
    title: "لأن اليوم الجميل يبدأ من هنا",
    text: "تجربة بسيطة، مريحة، ومليئة بالتفاصيل التي تجعل الزيارة ذكرى جميلة.",
    sortOrder: 5,
    config: {
      points: [
        { title: "إطلالة بحرية", text: "استمتعوا بأجواء البحر والهواء العليل على كورنيش الحديدة.", iconKey: "waves" },
        { title: "مناسب للعائلة", text: "تصميم وتجربة تجمع أفراد الأسرة في مكان واحد.", iconKey: "heart" },
        { title: "تجربة متكاملة", text: "مرافق وخدمات متعددة لقضاء يوم مليء بالأنشطة.", iconKey: "sparkles" },
        { title: "موقع مميز", text: "في منطقة الكورنيش بالحديدة وسهل الوصول إليه.", iconKey: "map-pin" },
      ],
    },
  },
  { key: "gallery", eyebrow: "معرض الصور والفيديو", title: "لحظات تستحق أن تُرى", text: "لمحات من الأجواء والمرافق التي تنتظركم.", sortOrder: 6, config: { albumSlug: "main", count: 3 } },
  { key: "offers", eyebrow: "العروض والخصومات", title: "عروض خاصة لمناسباتكم", text: "اختيارات من العروض الموسمية التي تضيف قيمة أكبر لزيارتكم.", sortOrder: 7, config: {} },
  {
    key: "cta",
    eyebrow: "",
    title: "جاهز لقضاء وقت مختلف؟",
    text: "احجز زيارتك واستمتع بتجربة خليج الدولفين.",
    sortOrder: 8,
    config: { primaryBtn: { label: "احجز الآن", href: "/book" }, secondaryBtn: { label: "تواصل معنا", href: "/contact" } },
  },
];

for (const s of sections) {
  await db.homeSection.upsert({
    where: { key: s.key },
    update: {},
    create: {
      key: s.key,
      eyebrow: s.eyebrow,
      title: s.title,
      text: s.text,
      sortOrder: s.sortOrder,
      visible: true,
      configJson: JSON.stringify(s.config),
    },
  });
}

const pages = ["home", "rooms", "services", "facilities", "gallery", "offers", "about", "contact", "book"];
for (const slug of pages) {
  await db.page.upsert({
    where: { slug },
    update: {},
    create: { slug, title: slug, status: "published" },
  });
}

const nav = [
  ["الرئيسية", "/", 0],
  ["الغرف", "/rooms", 1],
  ["الخدمات", "/services", 2],
  ["المعرض", "/gallery", 3],
  ["العروض", "/offers", 4],
  ["عن المنتزه", "/about", 5],
  ["تواصل معنا", "/contact", 6],
];
for (const [label, href, order] of nav) {
  const existing = await db.navItem.findFirst({ where: { href, location: "header" } });
  if (!existing) {
    await db.navItem.create({ data: { label, href, sortOrder: order, visible: true, location: "header" } });
  }
}

const settings = {
  "site.name": "منتزه خليج الدولفين",
  "site.shortName": "خليج الدولفين",
  "site.tagline": "مقصد ترفيهي عائلي على كورنيش الحديدة",
  "map.embedUrl": "https://www.google.com/maps?q=14.7847149,42.9450447&z=17&output=embed",
  "map.linkUrl": "https://maps.app.goo.gl/mWtCVQqsBcDbdkx69",
  "map.address": "كورنيش الحديدة — اليمن",
  "map.hours": "يُستقبل الزوار وفق الجدول اليومي للمنتزه",
  "contact.phone": "05X XXX XXXX",
  "contact.email": "info@dolphinpark.example",
  "social.whatsapp": "https://wa.me/967777777777",
  "social.instagram": "https://instagram.com/dolphinpark.example",
  "social.facebook": "https://facebook.com/dolphinpark.example",
  "social.youtube": "https://youtube.com/@dolphinpark.example",
  "social.tiktok": "https://tiktok.com/@dolphinpark.example",
};

for (const [key, value] of Object.entries(settings)) {
  await db.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
}

console.log("seed complete");
await db.$disconnect();
