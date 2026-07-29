import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "@/app/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} Webinar`,
    short_name: "GELD Webinar",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#030303",
    theme_color: "#030303",
    icons: [
      {
        src: "/new_geld_g_logo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
