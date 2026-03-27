import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HyroWOD",
    short_name: "CF Korea",
    description: "전국 크로스핏 박스를 지도로 검색하고, 시간표와 후기, 코치 정보를 한눈에 확인하세요.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#e8220a",
    orientation: "portrait",
    categories: ["fitness", "sports", "health"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        form_factor: "wide" as any,
      },
    ],
  };
}
