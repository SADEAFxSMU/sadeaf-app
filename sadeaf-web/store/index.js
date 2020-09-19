export const state = () => ({
  /**
   * Placeholder while nuxt auth + cognito is under development
   */
  auth: {
    userType: 'client',
    client: {
      id: 1,
      account: {
        name: 'Jon',
        username: 'JonLee1995',
        email: 'jonlee@gmail.com',
      }
    },
  }
});

export const mutations = {
  setUserType(state, {userType}) {
    state.userType = userType;
  },
  setUser(state, {userType, user}) {
    state.auth = {userType, [userType]: user};
  },
}
