import VuexFire from 'vuexfire'
var VuexFireMutations = VuexFire.mutations;

export const mutations = {
    VuexFireMutations,
    mutateResources (state, resources) {
      // state.resources.push(resources);
      console.log('mutate resources', resources);
      state.resources = resources;
    },
    mutateUsers (state, users) {
      state.users = users;
    },
    mutateUserInfo (state, user) {
      state.userInfo = user
    },
    mutateSignIn (state, user) {
      state.userInfo = user
    }
}