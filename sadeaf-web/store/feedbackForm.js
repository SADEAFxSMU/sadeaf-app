export const state = () => ({
  visible: false,
  volunteer: {},
  event: {},
  feedbackId: null,
});

export const mutations = {
  submitForm(state) {
    state.visible = false;
  },
  clickForm(state, { volunteer, event, feedbackId }) {
    state.volunteer = volunteer;
    state.visible = true;
    state.event = event;
    state.feedbackId = feedbackId;
  },
  hideForm(state) {
    state.visible = false;
  },
};
