import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/auth/",
          "/dashboard/",
          "/admin/",
          "/api/",
          "/clients",
          "/memberships",
          "/payments",
          "/staff",
          "/reports",
          "/leads",
          "/loyalty",
          "/access-control",
          "/profile",
          "/bookings",
          "/marketplace/",
          "/shop",
        ],
      },
    ],
    sitemap: "https://www.leetssports.com/sitemap.xml",
  };
}