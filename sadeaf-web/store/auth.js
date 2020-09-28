export const state = () => ({
  /**
   * Placeholder while nuxt auth + cognito is under development
   */
  user: {}
})

export const mutations = {
  setUserType(state, userType) {
    state.user.userType = userType;
  },
  setUser(state, {userType, user}) {
    state.user = { userType, ...user };
  },
}
