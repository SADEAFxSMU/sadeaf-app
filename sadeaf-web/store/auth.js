export const state = () => ({
  /**
   * Placeholder while nuxt auth + cognito is under development
   */
  user: {
    name: 'Jon',
    username: 'JonLee1995',
    email: 'jonlee@gmail.com',
    userType: 'client',
    client: {
      id: 1,
    },
  }
})

export const mutations = {
  setUserType(state, userType) {
    state.user.userType = userType;
  },
  setUser(state, {userType, user}) {
    state.user = { userType, ...user };
  },
}
