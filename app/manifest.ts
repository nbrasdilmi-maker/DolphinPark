import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "منتزه خليج الدولفين",
    short_name: "خليج الدولفين",
    description: "مقصد ترفيهي عائلي على كورنيش الحديدة",
    start_url: "/",
    display: "standalone",
    dir: "rtl",
    lang: "ar",
    background_color: "#ffffff",
    theme_color: "#062f61",
    icons: [{ src: "/logo.png", sizes: "512x512", type: "image/png" }],
  };
}
