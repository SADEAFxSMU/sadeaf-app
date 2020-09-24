export default {
  mode: 'spa',
  target: 'server',
  head: {
    title: 'SADEAF Management',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'SADEAF'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  plugins: [
    '@/plugins/amplify-cognito',
    '@/plugins/apollo',
    '@/plugins/hasura-role',
    '@/plugins/element-ui',
  ],
  components: true,
  buildModules: [],
  modules: [
    '~/hasura',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  serverMiddleware: [
    {prefix: false, handler: '~/api'}
  ],
  build: {
    transpile: [/^element-ui/],
    extend(config, ctx) {
    }
  },
  router: {
    middleware: 'authenticated'
  }
}
