import type { ReactNode } from "react";
import {
  Users,
  Camera,
  UtensilsCrossed,
  FerrisWheel,
  MapPin,
  Heart,
  Sparkles,
  Coffee,
  ShoppingBasket,
  Sofa,
  Umbrella,
  Tent,
  Sailboat,
  Bike,
  Ticket,
  Snowflake,
  Waves as WavesIcon,
} from "@/components/icons";

export const img = {
  hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=85",
  about:
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85",
  g1: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1000&q=85",
  g2: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85",
  g3: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
  g4: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=85",
  g5: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
  g6: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85",
  g7: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=85",
  g8: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85",
  g9: "https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=1000&q=85",
  r1: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=85",
  r2: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=85",
  r3: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85",
};

export type Facility = {
  icon: ReactNode;
  title: string;
  text: string;
};

export const facilities: Facility[] = [
  {
    icon: <Users size={26} strokeWidth={1.8} />,
    title: "العائلات",
    text: "أجواء مريحة ومساحات مناسبة لقضاء يوم جميل مع العائلة.",
  },
  {
    icon: <Camera size={26} strokeWidth={1.8} />,
    title: "التصوير التذكاري",
    text: "زوايا بحرية جميلة لصناعة صور وذكريات تستحق الاحتفاظ بها.",
  },
  {
    icon: <UtensilsCrossed size={26} strokeWidth={1.8} />,
    title: "المطاعم والمقاهي",
    text: "خيارات متنوعة للطعام والمشروبات خلال زيارتكم للمنتزه.",
  },
  {
    icon: <FerrisWheel size={26} strokeWidth={1.8} />,
    title: "الألعاب الترفيهية",
    text: "مساحات وأنشطة ترفيهية تضيف المزيد من المتعة لكل أفراد الأسرة.",
  },
  {
    icon: <WavesIcon size={26} strokeWidth={1.8} />,
    title: "المسبح",
    text: "مساحة مائية للترفيه والاسترخاء ضمن مرافق المنتزه.",
  },
];

export type Room = {
  src: string;
  alt: string;
  title: string;
  desc: string;
  capacity: number;
  features: string[];
  price: string;
};

export const rooms: Room[] = [
  {
    src: img.r1,
    alt: "غرفة عائلية",
    title: "غرفة عائلية",
    desc: "مساحة واسعة تناسب العائلات بإطلالة هادئة ومرافق مريحة.",
    capacity: 5,
    features: ["سرير مزدوج", "شبكة واي فاي", "حمام خاص"],
    price: "45,000 ريال",
  },
  {
    src: img.r2,
    alt: "جناح دولفين",
    title: "جناح دولفين",
    desc: "جناح مميز بإطلالة بحرية وتجهيزات راقية لقضاء إقامة خاصة.",
    capacity: 4,
    features: ["إطلالة بحر", "غرفة جلوس", "خدمة الغرفة"],
    price: "75,000 ريال",
  },
  {
    src: img.r3,
    alt: "غرفة مزدوجة",
    title: "غرفة مزدوجة",
    desc: "خيار مريح واقتصادي للأزواج مع كل أساسيات الإقامة.",
    capacity: 2,
    features: ["سرير زوجي", "تلفاز", "تكييف"],
    price: "28,000 ريال",
  },
];

export type Service = {
  icon: ReactNode;
  title: string;
  text: string;
};

export const services: Service[] = [
  {
    icon: <UtensilsCrossed size={24} strokeWidth={1.8} />,
    title: "مطعم المنتزه",
    text: "أطباق متنوعة وأجواء مريحة على البحر.",
  },
  {
    icon: <Coffee size={24} strokeWidth={1.8} />,
    title: "كافتيريا وبوفيه",
    text: "مشروبات ووجبات خفيفة طوال اليوم.",
  },
  {
    icon: <ShoppingBasket size={24} strokeWidth={1.8} />,
    title: "بقالة ولوازم الشاطئ",
    text: "كل ما يحتاجه الزائر في مكان واحد.",
  },
  {
    icon: <Sofa size={24} strokeWidth={1.8} />,
    title: "جلسات شيشة",
    text: "جلسات مريحة بإطلالة على أجواء الكورنيش.",
  },
  {
    icon: <Umbrella size={24} strokeWidth={1.8} />,
    title: "كراسي ومظلات بحرية",
    text: "مناطق ظل وجلوس مباشرة على الشاطئ.",
  },
  {
    icon: <Tent size={24} strokeWidth={1.8} />,
    title: "خيام استراحة",
    text: "خيام خاصة للراحة والخصوصية.",
  },
  {
    icon: <Sailboat size={24} strokeWidth={1.8} />,
    title: "رحلات بحرية وأنشطة",
    text: "جولات وأنشطة تزيد المتعة على الماء.",
  },
  {
    icon: <Bike size={24} strokeWidth={1.8} />,
    title: "خدمات مستقبلية",
    text: "خطط دائمًا لتطوير تجربة الزوار بمزيد من الخيارات.",
  },
];

export type Offer = {
  icon: ReactNode;
  badge: string;
  title: string;
  text: string;
};

export const offers: Offer[] = [
  {
    icon: <Ticket size={24} strokeWidth={1.8} />,
    badge: "خصم 20%",
    title: "عرض نهاية الأسبوع",
    text: "قضاء نهاية أسبوع مريحة مع خصم خاص على الإقامة.",
  },
  {
    icon: <Users size={24} strokeWidth={1.8} />,
    badge: "خصم 25%",
    title: "عرض العائلة الممتدة",
    text: "للعائلات الكبيرة: حجوزات موسّعة بأسعار أفضل.",
  },
  {
    icon: <Snowflake size={24} strokeWidth={1.8} />,
    badge: "خصم 30%",
    title: "عرض الشتاء الدافئ",
    text: "خيام وجلسات بأجواء دافئة بدأ من نص السعر.",
  },
];

export type Reason = {
  icon: ReactNode;
  title: string;
  text: string;
};

export const reasons: Reason[] = [
  {
    icon: <WavesIcon size={26} strokeWidth={1.8} />,
    title: "إطلالة بحرية",
    text: "استمتعوا بأجواء البحر والهواء العليل على كورنيش الحديدة.",
  },
  {
    icon: <Heart size={26} strokeWidth={1.8} />,
    title: "مناسب للعائلة",
    text: "تصميم وتجربة تجمع أفراد الأسرة في مكان واحد.",
  },
  {
    icon: <Sparkles size={26} strokeWidth={1.8} />,
    title: "تجربة متكاملة",
    text: "مرافق وخدمات متعددة لقضاء يوم مليء بالأنشطة.",
  },
  {
    icon: <MapPin size={26} strokeWidth={1.8} />,
    title: "موقع مميز",
    text: "في منطقة الكورنيش بالحديدة وسهل الوصول إليه.",
  },
];

export type GalleryItem = {
  src: string;
  alt: string;
  label: string;
  video?: boolean;
};

export const galleryItems: GalleryItem[] = [
  { src: img.g1, alt: "أجواء البحر", label: "أجواء البحر" },
  { src: img.g2, alt: "وقت العائلة", label: "وقت العائلة" },
  { src: img.g3, alt: "لحظات لا تُنسى", label: "لحظات لا تُنسى", video: true },
  { src: img.g4, alt: "كراسي الشاطئ", label: "كراسي الشاطئ" },
  { src: img.g5, alt: "منتجعات منتزهية", label: "الإقامة" },
  { src: img.g6, alt: "أجواء المغامرة", label: "الأنشطة" },
  { src: img.g7, alt: "غروب على البحر", label: "الغروب" },
  { src: img.g8, alt: "منطقة الجلوس", label: "الجلوس" },
  { src: img.g9, alt: "مقعدان على الشاطئ", label: "الاسترخاء" },
];