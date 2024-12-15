// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync } from "fs";
import { posix } from "path";

const assets = readdirSync("./public/assets", { recursive: true });

const preloadLinks: { rel: "preload"; href: string; as: "image" }[] = assets
  .filter((asset) => asset.toString().endsWith(".webp"))
  .map((asset) => {
    return {
      rel: "preload",
      href: posix.join("/assets", asset.toString()),
      as: "image",
    };
  });

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      title: "辽河满韵",
      link: preloadLinks,
    },
  },
});
