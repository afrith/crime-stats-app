import type { Route } from "./+types/geom";
import { getProvinces } from "~/db/structures";
import { getStations } from "~/db/stations";
import { SitemapStream, streamToPromise } from "sitemap";
import { cache } from "react";

let cachedSitemap: string | null = null;

export async function loader({ request }: Route.LoaderArgs) {
  if (cachedSitemap == null) {
    const [provinces, stations] = await Promise.all([
      getProvinces(),
      getStations(),
    ]);

    const sitemap = new SitemapStream({
      hostname: process.env.VITE_CANONICAL_URL,
    });

    sitemap.write({ url: "/", changefreq: "weekly", priority: 1.0 });
    sitemap.write({ url: "/about", changefreq: "monthly", priority: 0.8 });

    provinces.forEach((prov) => {
      sitemap.write({
        url: `/province/${prov.prov_code}`,
        changefreq: "monthly",
        priority: 0.7,
      });
    });

    stations.forEach((station) => {
      sitemap.write({
        url: `/station/${station.slug}`,
        changefreq: "monthly",
        priority: 0.6,
      });
    });

    const prom = streamToPromise(sitemap).then((sm) => sm.toString());
    sitemap.end();
    cachedSitemap = await prom;
  }

  return new Response(cachedSitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
