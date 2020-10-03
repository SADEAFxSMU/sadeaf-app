export const state = () => ({
  visible: false,
  volunteer: {},
  event: {},
});

export const mutations = {
  clickDialog(state, { volunteer, event }) {
    state.visible = true;
    state.volunteer = volunteer;
    state.event = event;
  },
  hideDialog(state) {
    state.visible = false;
  },
};
