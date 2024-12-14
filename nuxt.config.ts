// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      title: "辽河满韵",
    },
  },
  plugins: [
      '~/plugins/speechSynthesis.js',
      '~/plugins/element-plus.js'
  ],
});
