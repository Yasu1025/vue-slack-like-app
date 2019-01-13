import Vue from 'vue'
import Vuex from 'vuex'
import * as type from './mutationTypes'

Vue.use(Vuex)

const state = {
    currentUser: null
}

const mutations = {
    [type.SET_USER](state, payload) {
        state.currentUser = payload
    }
}

const actions = {
    setUser({ commit }, payload) {
        commit(type.SET_USER, payload)
    }
}

const getters = {
    currentUser: state => state.currentUser
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})