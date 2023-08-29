import Vue from 'vue';
import Vuex from 'vuex';
import {
  state as vacanciesState,
  mutations as vacanciesMutations,
  actions as shiftActions,
  getters as shiftGetters
} from './vacancies';

Vue.use(Vuex);

export default () => new Vuex.Store({
  modules: {
    vacancies: {
      namespaced: false,
      state: vacanciesState,
      mutations: vacanciesMutations,
      actions: shiftActions,
      getters: shiftGetters,
    },
    // Other modules can be added here if needed
  },
});
