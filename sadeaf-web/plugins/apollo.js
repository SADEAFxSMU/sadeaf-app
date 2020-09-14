import Vue from 'vue'
import VueApollo from 'vue-apollo'
import {HttpLink} from 'apollo-link-http';
import {ApolloClient} from 'apollo-client'
import {split} from 'apollo-link'
import {InMemoryCache} from 'apollo-cache-inmemory'
import MessageTypes from 'subscriptions-transport-ws/dist/message-types'
import {WebSocketLink} from 'apollo-link-ws'
import {getMainDefinition} from 'apollo-utilities'
import {setContext} from 'apollo-link-context'
import {Auth} from "aws-amplify";

Vue.use(VueApollo)

/**
 * Get Authorization token from aws-amplify
 * @return {Promise<string|null>}
 */
async function getToken() {
  const jwtToken = await Auth.currentSession()
    .then((session) => {
      return session.getIdToken().getJwtToken()
    })
    .catch(() => null)

  if (jwtToken) {
    return `Bearer ${jwtToken}`
  }
  return null
}

export default ({app}, inject) => {
  const authLink = setContext(async (_, {headers}) => {
    const token = await getToken()

    return {
      headers: {
        ...headers,
        Authorization: token || undefined
      },
    }
  })

  const httpLink = authLink.concat(new HttpLink({
    uri: '/api/graphql',
  }))

  const wsLink = new WebSocketLink({
    // TODO(fuxing): Inject and change to wss for production
    uri: 'ws://localhost:3000/api/graphql',
    options: {
      reconnect: true,
      lazy: true,
      connectionParams: async () => {
        const token = await getToken() || undefined

        // Must be exactly this, hasura required
        if (token) {
          return {headers: {Authorization: token}}
        }
      }
    }
  })

  const link = split(
    ({query}) => {
      const {kind, operation} = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  )

  const apolloClient = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  })

  app.apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    errorHandler(error) {
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    }
  })

  inject('apolloHelpers', {
    onLogin: async (apolloClient = app.apolloProvider.defaultClient) => {
      const wsClient = apolloClient.wsClient
      if (!wsClient) return

      const operations = Object.assign({}, wsClient.operations)
      wsClient.close(true)
      wsClient.connect()

      // Push all current operations to the new connection
      Object.keys(operations).forEach(id => {
        wsClient.sendMessage(id, MessageTypes.GQL_START, operations[id].options)
      })

      await apolloClient.resetStore()
    },
    onLogout: async (apolloClient = app.apolloProvider.defaultClient) => {
      const wsClient = apolloClient.wsClient
      if (!wsClient) return

      wsClient.close(true)
      await apolloClient.resetStore()
    },
  })
}
