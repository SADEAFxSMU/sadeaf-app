export const state = () => ({
  visible: false,
  volunteer: {},
  event: {},
})

export const mutations = {
  submitForm(state) {
    state.visible = false;
  },
  clickForm(state, { volunteer, event }) {
    state.volunteer = volunteer;
    state.visible = true;
    state.event = event;
  },
  hideForm(state) {
    state.visible = false;
  }
}


