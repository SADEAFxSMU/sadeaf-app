export default {
  mode: 'spa',
  target: 'server',
  head: {
    title: 'SADEAF Management',
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
    {src: '@/plugins/amplify-cognito', ssr: false},
  ],
  components: true,
  buildModules: [],
  modules: [
    '~/hasura',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://apollo.vuejs.org
    '@nuxtjs/apollo',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/dayjs',
  ],
  serverMiddleware: [
    {prefix: false, handler: '~/api'}
  ],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: '/api/graphql',
        wsEndpoint: 'ws://localhost:3000/api/graphql',
      }
    }
  },
  build: {
    transpile: [/^element-ui/],
    extend(config, ctx) {
    }
  }
}
