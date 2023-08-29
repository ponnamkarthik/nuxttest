export const state = () => ({
  vacancies: [

  ],
});

export const mutations = {
  addVacancy(state, vacancy) {
    state.vacancies.push(vacancy);
  },
  updateVacancy(state, {index, vacancy}) {
    state.vacancies[index] = vacancy;
  },
  deleteVacancy(state, index) {
    console.log(state.vacancies);
    state.vacancies.splice(index, 1);
    console.log(state.vacancies);
  },
};

export const actions = {
  addVacancy({commit}, vacancy) {
    commit('addVacancy', vacancy);
  },
  updateVacancy({commit}, {index, vacancy}) {
    commit('updateVacancy', {index, vacancy});
  },
  deleteVacancy({commit}, index) {
    commit('deleteVacancy', index);
  }
};

export const getters = {
  vacancies(state) {
    return state.vacancies;
  }
}
