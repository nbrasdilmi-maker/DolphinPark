-- DolphinPark RLS policies (run AFTER schema.sql, production only)
-- Prisma connects as postgres (bypasses RLS) so the admin panel is unaffected.
-- anon (publishable key, used by Realtime) can read PUBLIC content only.
-- AdminUser / BookingRequest / ContactMessage / ActivityLog / MediaAsset:
-- no policy = fully denied for anon.

-- Room
GRANT SELECT ON public."Room" TO anon;
CREATE POLICY "anon public read" ON public."Room" FOR SELECT TO anon USING (status = 'published');

-- Service
GRANT SELECT ON public."Service" TO anon;
CREATE POLICY "anon public read" ON public."Service" FOR SELECT TO anon USING (status = 'published');

-- Facility
GRANT SELECT ON public."Facility" TO anon;
CREATE POLICY "anon public read" ON public."Facility" FOR SELECT TO anon USING (status = 'published');

-- Offer
GRANT SELECT ON public."Offer" TO anon;
CREATE POLICY "anon public read" ON public."Offer" FOR SELECT TO anon USING (status = 'published');

-- GalleryAlbum
GRANT SELECT ON public."GalleryAlbum" TO anon;
CREATE POLICY "anon public read" ON public."GalleryAlbum" FOR SELECT TO anon USING (status = 'published');

-- GalleryItem
GRANT SELECT ON public."GalleryItem" TO anon;
CREATE POLICY "anon public read" ON public."GalleryItem" FOR SELECT TO anon USING (true);

-- HeroSlide
GRANT SELECT ON public."HeroSlide" TO anon;
CREATE POLICY "anon public read" ON public."HeroSlide" FOR SELECT TO anon USING (status = 'published');

-- HomeSection
GRANT SELECT ON public."HomeSection" TO anon;
CREATE POLICY "anon public read" ON public."HomeSection" FOR SELECT TO anon USING (visible = true);

-- Page
GRANT SELECT ON public."Page" TO anon;
CREATE POLICY "anon public read" ON public."Page" FOR SELECT TO anon USING (status = 'published');

-- NavItem
GRANT SELECT ON public."NavItem" TO anon;
CREATE POLICY "anon public read" ON public."NavItem" FOR SELECT TO anon USING (visible = true);

-- SiteSetting
GRANT SELECT ON public."SiteSetting" TO anon;
CREATE POLICY "anon public read" ON public."SiteSetting" FOR SELECT TO anon USING (true);

-- SeoPage
GRANT SELECT ON public."SeoPage" TO anon;
CREATE POLICY "anon public read" ON public."SeoPage" FOR SELECT TO anon USING (true);

-- Testimonial (approved only - pending never leaks)
GRANT SELECT ON public."Testimonial" TO anon;
CREATE POLICY "anon public read" ON public."Testimonial" FOR SELECT TO anon USING (status = 'published');
