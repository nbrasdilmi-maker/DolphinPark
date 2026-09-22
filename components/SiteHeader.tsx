import { Header } from "@/components/Header";
import { getNav } from "@/lib/site-content";

export async function SiteHeader() {
  const links = await getNav("header");
  return <Header links={links} />;
}
