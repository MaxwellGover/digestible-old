// import VuexFire from 'vuexfire'

// var VuexFireMutations = VuexFire.mutations;

const mutations = {
    // VuexFireMutations,
    addPostKey(state, key) {
      state.postKey = key;
    },
    mutateResources (state, resources) {
      // state.resources.push(resources);
      console.log('mutate resources', resources);
      state.resources = resources;
    },
    incPassedResource(state, res) {
      const key = res['.key'];
      if (!state.passedResources[key]) {
        state.passedResources[key] = {timesPassed: 0};
      }
      console.log(state.passedResources[key], key, state.passedResources);;
      state.passedResources[key].timesPassed++;
      console.log('inc', state.passedResources[key], state.passedResources);
    },
    mutatePassedResources(state, res) {
      state.passedResources = res;
    },
    mutateUsers (state, users) {
      state.users = users;
    },
    mutateUserInfo (state, user) {
      state.userInfo = user;
    },
    mutateSignIn (state, user) {
      state.userInfo = user;
    },
    modalChange (state, modal) {
      state.modal = modal;
    },
    modalToggle (state, el) {
      state.modal.el = el;
      state.modal.show = !state.modal.show;
    }
};

// Object.assign(mutations, VuexFireMutations);

// console.log('mutations', mutations);

export default mutations