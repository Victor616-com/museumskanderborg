import { repositoryName, apiEndpoint } from "./slicemachine.config.json";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: "Prismic + Nuxt Minimal Starter",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "apple-mobile-web-app-title", content: "Museum Skanderborg" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
    },
  },

  modules: ["@nuxt/eslint", "@nuxtjs/prismic", "@unocss/nuxt", "@nuxt/image"],
  image: {
    provider: "prismic",
    screens: {
      bp375: 375,
      bp656: 656,
      bp960: 960,
      bp1280: 1280,
      bp1440: 1440,
      bp1536: 1536,
      bp1920: 1920,
      bp2560: 2560,
    },
  },

  prismic: {
    endpoint: apiEndpoint || repositoryName,
    preview: "/api/preview",
    clientConfig: {
      routes: [
        { type: "page", uid: "home", path: "/" },
        { type: "page", path: "/:uid" },
        { type: "event", path: "/events/:uid" },
      ],
    },
  },

  compatibilityDate: "2026-01-02",
  css: ["~/assets/css/main.css"],
});
