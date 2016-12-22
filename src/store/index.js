import Vuex from 'vuex'

import createLogger from 'vuex/dist/logger'
import createPersistedState from 'vuex-persistedstate'

import{ actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'

import quiz from './modules/quiz'

const debug = process.env.NODE_ENV !== 'production'

const state = {
    userInfo: {},
    users: {},
    resources: [],
    passedResources: [],
    answeredQuestions: [],
    postKey: '',
    modal: {
        el: '',     // el = modal container
        show: false // toggle visibility of modal attached to above el
    }
};

const plugins = [
    debug ? createLogger(): null,
    createPersistedState({
        paths: ['userInfo']
    })
];

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default {
    // root state
    state,
    actions,
    getters,
    mutations,
    modules: {
        quiz
    },
    // strict: debug, // <<<<<<<< todo: check why we're getting mutation errors if uncommented
    plugins
}
