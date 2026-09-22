import {
  Users,
  Camera,
  UtensilsCrossed,
  FerrisWheel,
  Waves,
  Heart,
  Sparkles,
  MapPin,
  Coffee,
  ShoppingBasket,
  Sofa,
  Umbrella,
  Tent,
  Sailboat,
  Bike,
  Ticket,
  Snowflake,
} from "@/components/icons";

const registry: Record<string, typeof Users> = {
  users: Users,
  camera: Camera,
  utensils: UtensilsCrossed,
  "ferris-wheel": FerrisWheel,
  waves: Waves,
  heart: Heart,
  sparkles: Sparkles,
  "map-pin": MapPin,
  coffee: Coffee,
  "shopping-basket": ShoppingBasket,
  sofa: Sofa,
  umbrella: Umbrella,
  tent: Tent,
  sailboat: Sailboat,
  bike: Bike,
  ticket: Ticket,
  snowflake: Snowflake,
};

export function IconByKey({ name, size = 24 }: { name?: string | null; size?: number }) {
  const Cmp = (name && registry[name]) || Sparkles;
  return <Cmp size={size} strokeWidth={1.8} />;
}

export function iconKeys(): string[] {
  return Object.keys(registry);
}
