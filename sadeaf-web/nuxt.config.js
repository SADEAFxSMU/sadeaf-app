export default {
  mode: 'spa',
  target: 'static',
  /*
  ** Headers of the page
  */
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
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui'
  ],
  components: true,
  buildModules: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    // Doc: https://apollo.vuejs.org
    '@nuxtjs/apollo',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true
  },
  /*
  ** Automatically routed in production with traefik
  ** This is adding for convenient sake for development only.
  ** As `target: static` will ignore it.
  */
  proxy: {
    '/api/v1': 'http://localhost:14000'
  },
  /*
  ** Apollo module configuration
  */
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: '/api/v1/graphql',
      }
    }
  },
  /*
  ** Nuxt auth configuration
   */
  router: {
    middleware: ['auth']
  },
  auth: {
    strategies: {
      dev: {
        scheme: 'oauth2',
        // TODO: Change these lines to env variables
        endpoints: {
          authorization: 'https://sadeaf-auth.auth.' +
            'us-east-1.amazoncognito.com/oauth2/authorize',
          userInfo: 'https://sadeaf-auth.auth.' +
            'us-east-1.amazoncognito.com/oauth2/userInfo',
          logout: 'https://sadeaf-auth.auth.' +
            'us-east-1.amazoncognito.com/logout',
        },
        // Make sure redirectUri, logoutRedirectUri is the same as what is configured on AWS Cognito
        redirectUri: 'http://localhost:3000/login',
        logoutRedirectUri: 'http://localhost:3000/login',
        clientId: '5hbhb0p5c37c1c1v4fv93pkbu0',
        // END OF ENV Variables
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800
        },
        scope: ['openid', 'email'],
        responseType: 'token',
        codeChallengeMethod: 'S256',
      }
    },
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  }
}
