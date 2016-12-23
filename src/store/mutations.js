import VuexFire from 'vuexfire'

var VuexFireMutations = VuexFire.mutations;

let mutations = {
    // VuexFireMutations,
    mutateResources (state, resources) {
      // state.resources.push(resources);
      console.log('mutate resources', resources);
      state.resources = resources;
    },
    mutatePassedResources(state, res) {
      state.passedResources = res;
    },
    mutateUsers (state, users) {
      state.users = users;
    },
    mutateUserInfo (state, user) {
      state.userInfo = user
    },
    mutateSignIn (state, user) {
      state.userInfo = user
    },
    modalChange (state, modal) {
      state.modal = modal;
    },
    modalToggle (state, el) {
      state.modal.el = el;
      state.modal.show = !state.modal.show;
    }
}

Object.assign(mutations, VuexFireMutations);

// console.log('mutations', mutations);

export default mutations