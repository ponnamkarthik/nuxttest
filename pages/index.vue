<template>
  <div class="relative min-h-screen bg-gray-100">
    <div class="flex flex-col space-y-12 px-24 py-12 mx-auto">
      <h1 class="text-2xl font-bold">Filter</h1>

      <div class="flex flex-row w-full space-x-4">
        <p>Filter on price</p>
        <b-field class="w-96">
          <b-slider v-model="priceRange" :min="0" :max="500" :step="50" ticks>
          </b-slider>
        </b-field>
      </div>

      <div class="flex flex-row justify-between">
        <h1 class="text-2xl font-bold">Shifts</h1>
        <button @click="showCreateEditDrawer(true, false)"
                class="mt-4 bg-gray-800 text-white py-2 px-8 rounded hover:bg-blue-600">
          Add Shift
        </button>
      </div>

      <div v-for="(vacancy, index) in filteredVacancies" :key="index">
        <!-- Display vacancy info -->
        <div class="bg-white px-6 py-4 shadow-xl space-y-6 flex flex-col">
          <div class="flex flex-row justify-between">
            <div class="">
              <h2 class="text-3xl font-bold">{{ vacancy.title }}</h2>
              <p>{{ vacancy.description }}</p>
            </div>
            <button @click="editVacancy(index)">
              <b-icon icon="pencil"></b-icon>
            </button>

          </div>
          <div class="flex flex-col pb-4 space-y-6">
            <h2 class="text-3xl font-bold">Dates</h2>
            <div class="flex flex-col space-y-4">
              <div class="flex flex-row justify-between px-4 py-2 bg-gray-800 rounded-md text-white w-full" v-for="(shift, key) in vacancy.datesData" :key="key">
                <p>{{ key }}</p>
                <p>{{ shift.startTime | formatTime }}</p>
                <p>{{ shift.endTime | formatTime }}</p>
                <p>{{ shift.type }}</p>
                <p>€{{ shift.price }}</p>
              </div>
            </div>
          </div>
          <!-- Display other details here -->
        </div>
      </div>
      <!-- Vacancy show empty state -->
      <div v-if="filteredVacancies.length === 0">
        <div class="flex flex-col items-center justify-center">
          <b-icon icon="emoticon-sad-outline" size="is-large"></b-icon>
          <h1 class="text-2xl font-bold">No shifts found</h1>
          <p class="text-gray-500">Add a new shift by clicking the button above</p>
        </div>
      </div>



    </div>

    <CreateEditDrawer v-if="showDrawer" :isEditing="isEditing" :editedIndex="editedIndex"
                      @close="showCreateEditDrawer(false, false)"/>
  </div>
</template>

<script>
import CreateEditDrawer from '~/components/CreateEditDrawer.vue';
import {mapGetters} from "vuex";

export default {
  components: {
    CreateEditDrawer,
  },
  data() {
    return {
      showDrawer: false,
      isEditing: false,
      editedIndex: -1,
      priceRange: [0, 500],
    };
  },
  computed: {
    ...mapGetters(['vacancies']),
    filteredVacancies() {
      return this.vacancies.filter(vacancy => {
        let hasShift = false
        for (const date in vacancy.datesData) {
          if (vacancy.datesData.hasOwnProperty(date)) {
            const dateData = vacancy.datesData[date];
            const price = parseFloat(dateData.price);

            hasShift = !isNaN(price) && price >= this.priceRange[0] && price <= this.priceRange[1];
          }
        }
        return hasShift;
      });
    },
  },
  methods: {
    editVacancy(index) {
      this.isEditing = true;
      this.editedIndex = index;
      this.showCreateEditDrawer(true, true);
    },
    deleteVacancy(index) {
      this.$store.commit('deleteVacancy', index);
    },
    showCreateEditDrawer(show, editing) {
      this.showDrawer = show;
      this.isEditing = editing;
    },
  },
};
</script>

<style scoped>
/* Add your Tailwind CSS classes here */
</style>
