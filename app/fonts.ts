import localFont from "next/font/local";

export const cairo = localFont({
  src: [
    { path: "./fonts/Cairo-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Cairo-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Cairo-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Cairo-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Cairo-ExtraBold.ttf", weight: "800", style: "normal" }
  ],
  variable: "--font-cairo",
  display: "swap",
  preload: false
});