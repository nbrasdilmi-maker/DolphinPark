-- DolphinPark realtime publication (run ONCE in Supabase SQL Editor, production only)
-- Tables written by Prisma (server) broadcast to visitors via Supabase Realtime.
-- Content tables are public-read by design; AdminUser is NEVER added here.

alter publication supabase_realtime add table public."Room";
alter publication supabase_realtime add table public."Service";
alter publication supabase_realtime add table public."Facility";
alter publication supabase_realtime add table public."Offer";
alter publication supabase_realtime add table public."GalleryAlbum";
alter publication supabase_realtime add table public."GalleryItem";
alter publication supabase_realtime add table public."HomeSection";
alter publication supabase_realtime add table public."HeroSlide";
alter publication supabase_realtime add table public."Testimonial";
