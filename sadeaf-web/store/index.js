import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      // Dummy client while auth is under development
      auth: {
        client: {
          id: 1,
          account: {
            name: 'Jon',
            username: 'JonLee1995',
            email: 'jonlee@gmail.com',
          }
        }
      }
    }
  })
}

export default createStore
