import Vue from 'vue'
import Vuex from 'vuex'
import * as type from './mutationTypes'

Vue.use(Vuex)

const state = {
    currentUser: null,
    currentChannel: null
}

const mutations = {
    [type.SET_USER](state, payload) {
        state.currentUser = payload
    },
    [type.SET_CURRENT_CH](state, payload) {
        state.currentChannel = payload
    }
}

const actions = {
    setUser({ commit }, payload) {
        commit(type.SET_USER, payload)
    },
    setCurrentChannel({ commit }, payload) {
        commit(type.SET_CURRENT_CH, payload)
    }
}

const getters = {
    currentUser: state => state.currentUser,
    currentChannel: state => state.currentChannel
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})