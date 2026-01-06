/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://doxynix.space",
  generateRobotsTxt: true,
  exclude: ["/dashboard/*", "/profile/*", "/repo/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/profile",
          "/dashboard/settings",
          "/dashboard/repo",
          "/dashboard/notifications",
          "/api",
        ],
      },
    ],
  },
};
