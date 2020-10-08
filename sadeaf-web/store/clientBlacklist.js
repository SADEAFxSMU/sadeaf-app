export const state = () => ({
  visible: false,
  volunteer: {},
  assignments: [],
});

export const mutations = {
  clickDialog(state, { volunteer, assignments }) {
    state.visible = true;
    state.volunteer = volunteer;
    state.assignments = assignments;
  },
  hideDialog(state) {
    state.visible = false;
  },
};
