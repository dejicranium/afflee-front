export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'Afflee',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
            { href: 'https://fonts.googleapis.com/css?family=Quicksand:300,500|Playfair+Display:700i', rel: 'stylesheet' }

        ]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        /*{ src: "~/plugins/api", ssr: true },*/

    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        '@nuxtjs/tailwindcss',

    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@nuxt/http',
    ],

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {}
}