export default {
  mode: 'spa',
  target: 'server',
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/dayjs',
  ],
  components: true,
  buildModules: [],
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://apollo.vuejs.org
    '@nuxtjs/apollo',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/dayjs',
  ],
  serverMiddleware: {
    '/api/v1': '~/src'
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: '/api/v1/graphql',
        wsEndpoint: 'ws://api/v1/graphql',
      }
    }
  },
  build: {
    transpile: [/^element-ui/],
    extend(config, ctx) {
    }
  }
}
