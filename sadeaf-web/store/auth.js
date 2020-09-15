export const state = () => ({
  /**
   * Placeholder while nuxt auth + cognito is under development
   */
  user: {
    userType: 'client',
    client: {
      id: 1,
      account: {
        name: 'Jon',
        username: 'JonLee1995',
        email: 'jonlee@gmail.com',
      }
    },
    volunteer: {
      id: 1,
      account: {
        name: 'Toh Jin Wee Wayne',
        username: 'waynetoh',
        email: 'waynetoh@gmail.com',
      }
    }
  }
})

export const mutations = {
  setUserType(state, userType) {
    state.user.userType = userType;
  },
  setUser(state, {userType, user}) {
    state.user = {userType, [userType]: user};
  },
}
