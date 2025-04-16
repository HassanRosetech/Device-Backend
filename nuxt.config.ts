// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr:false,
  css:[
    "~/assets/scss/app.scss",
    "~/assets/scss/responsive.scss",
    "~/assets/scss/ratio.scss",
    "~/assets/scss/style.scss",
    "~/assets/css/style.css",
    "~/assets/css/font-awesome.css",
    "~/assets/css/linearicon.css",
    "~/assets/css/magnific-popup.css",
    "~/assets/css/ratio.css",
    "~/assets/css/responsive.css",
    "~/assets/css/select2.min.css",
    "~/assets/css/slick-theme.css",
    "~/assets/css/slick.css",
    "~/assets/css/vector-map.css",
    "~/assets/css/vectormap.css",
    "~/assets/css/vendors/bootstrap/bootstrap-grid.css",
    "~/assets/css/vendors/bootstrap/bootstrap-reboot.css",
    "~/assets/css/vendors/bootstrap/bootstrap-utilities.css",
    "~/assets/css/vendors/bootstrap/bootstrap.css",
    "~/assets/css/vendors/bootstrap/bootstrap.rtl.min.css",
    "~/assets/css/vendors/animate.css",
    "~/assets/css/vendors/bootstrap-tagsinput.css",
    "~/assets/css/vendors/bootstrap.css",
    "~/assets/css/vendors/chartist.css",
    "~/assets/css/vendors/date-picker.css",
    "~/assets/css/vendors/daterange-picker.css",
    "~/assets/css/vendors/dropzone.css",
    "~/assets/css/vendors/echart.css",
    "~/assets/css/vendors/feather-icon.css",
    "~/assets/css/vendors/font-awesome.css",
    "~/assets/css/vendors/mapsjs-ui.css",
    "~/assets/css/vendors/owlcarousel.css",
    "~/assets/css/vendors/rating.css",
    "~/assets/css/vendors/ratio.css",
    "~/assets/css/vendors/scrollable.css",
    "~/assets/css/vendors/scrollbar.css",
    "~/assets/css/vendors/sticky.css",
    "~/assets/css/vendors/svg-icon.css",
    "~/assets/css/vendors/timepicker.css",
    "~/assets/css/vendors/themify.css",
    "~/assets/css/vendors/vector-map.css",
    "~/assets/css/vendors/sweetalert2.css"
  ],
  
  runtimeConfig: {
    databaseUrl: process.env.NUXT_DATABASE_URL,
  },

  modules: ["@kgierke/nuxt-basic-auth"],

  basicAuth: {
    enabled: true,
    users: [
      {
        username: "admin",
        password: "admin@partsshop",
      },
      {
        username: "Hassan",
        password: "Hassan",
      }
    ],
    
  },
})
