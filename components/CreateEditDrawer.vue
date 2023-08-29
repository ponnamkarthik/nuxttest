<template>
  <div>
    <b-sidebar
      :overlay="true"
      :right="true"
      :fullheight="true"
      v-model="open"
      @close="close"
    >
      <div class="px-4 py-8 flex flex-col h-full overflow-hidden space-y-4">
        <h1 class="text-2xl font-bold">
          Create / Edit
        </h1>
        <div class="flex flex-col h-full overflow-scroll">
          <b-field label="Title"
                   :type="validationErrors.title.length > 0 ? 'is-danger' : ''"
                   :message="validationErrors.title.join(' ')">
            <b-input maxlength="100" v-model="formData.title"></b-input>
          </b-field>
          <b-field label="Description"
                   :type="validationErrors.description.length > 0 ? 'is-danger' : ''"
                   :message="validationErrors.description.join(' ')">
            <b-input maxlength="500" v-model="formData.description" type="textarea"></b-input>
          </b-field>
          <b-field label="Dates"
                   :type="validationErrors.dates.length > 0 ? 'is-danger' : ''"
                   :message="validationErrors.dates.join(' ')">
            <b-datepicker
              @input="onDateUpdated"
              placeholder="Click to select..."
              v-model="formData.dates"
              icon-right="calendar-today"
              multiple>
            </b-datepicker>
          </b-field>
          <div class="mt-4 flex flex-col space-y-4">
            <template v-for="(date, index) in formData.datesString">
              <div class="flex flex-col" :key="index">
                <div class="flex flex-row justify-between">
                  <h2>{{ date }}</h2>
                  <button class="ml-auto" @click="removeDateData(date)">
                    <b-icon icon="close"></b-icon>
                  </button>
                </div>
                <div class="bg-gray-400 p-4 ">
                  <div class="flex flex-row space-x-4">
                    <b-field label="Start time"
                             :type="validationErrors.datesData[date].startTime ? 'is-danger' : ''"
                             :message="validationErrors.datesData[date].startTime">
                      <b-timepicker
                        v-model="formData.datesData[date].startTime"
                        icon-right="clock-time-five-outline"
                        placeholder="">
                      </b-timepicker>
                    </b-field>
                    <b-field label="End time"
                             :type="validationErrors.datesData[date].endTime ? 'is-danger' : ''"
                             :message="validationErrors.datesData[date].endTime">
                      <b-timepicker
                        v-model="formData.datesData[date].endTime"
                        icon-right="clock-time-five-outline"
                        placeholder="">
                      </b-timepicker>
                    </b-field>
                    <b-field label="Price"
                             :type="validationErrors.datesData[date].price ? 'is-danger' : ''"
                             :message="validationErrors.datesData[date].price">
                      <b-input
                        v-model="formData.datesData[date].price"
                        icon-right="currency-eur"></b-input>
                    </b-field>
                  </div>
                  <b-field label="Type" class="w-full"
                           :type="validationErrors.datesData[date].type ? 'is-danger' : ''"
                           :message="validationErrors.datesData[date].type">
                    <b-select
                      v-model="formData.datesData[date].type"
                      placeholder="Select a type">
                      <option value="Consultation">Consultation</option>
                      <option value="Telephone">Telephone</option>
                      <option value="Ambulance">Ambulance</option>
                    </b-select>
                  </b-field>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="flex flex-row space-x-4">
          <b-button
            v-if="isEditing"
            class="w-full" @click="deleteVacancy">
            Delete
          </b-button>
          <b-button
            class="w-full"
            @click="save" type="is-primary">
            Save
          </b-button>

        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
    editedIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      open: false,
      formData: {
        title: '',
        description: '',
        dates: [],
        datesString: [],
        datesData: {},
      },
      validationErrors: {
        title: [],
        description: [],
        datesData: {},
        dates: [],
      },
    };
  },
  methods: {
    save() {
      // Implement save/update logic and validation
      if (this.isEditing) {
        this.updateVacancy();
      } else {
        this.addVacancy();
      }
    },
    loadEditedData() {
      try {
        let vacancy = this.$store.state.vacancies.vacancies[this.editedIndex];
        this.formData.title = vacancy.title;
        this.formData.description = vacancy.description;
        this.formData.dates = vacancy.dates;
        this.formData.datesString = vacancy.datesString;
        this.formData.datesData = vacancy.datesData;
        this.onDateUpdated();
      } catch (e) {

      }
    },
    resetForm() {

    },
    async addVacancy() {
      if (this.validateForm()) {
        this.$store.dispatch('addVacancy', this.formData);
        this.close();
      } else {
        console.log("Form validation failed");
      }
    },
    removeDateData(date) {
      for (let i = 0; i < this.formData.dates.length; i++) {
        let dateString = this.$options.filters.formatDate(this.formData.dates[i]);
        if (dateString === date) {
          this.formData.dates.splice(i, 1);
          this.formData.datesString.splice(i, 1)
        }
      }
      delete this.validationErrors.datesData[date];
      delete this.formData.datesData[date];
    },
    onDateUpdated() {
      let newDatesData = {};
      let validatesDatesData = {};
      let datesString = []
      for (const date of this.formData.dates) {
        let dateString = this.$options.filters.formatDate(date);
        datesString.push(dateString);
        if (!this.formData.datesData[dateString]) {
          newDatesData[dateString] = {
            startTime: '',
            endTime: '',
            price: "",
            type: "",
          };
        } else {
          newDatesData[dateString] = this.formData.datesData[dateString];
        }
        if(!this.validationErrors.datesData[dateString]) {
          validatesDatesData[dateString] = {
            startTime: '',
            endTime: '',
            price: '',
            type: '',
          };
        } else {
          validatesDatesData[dateString] = this.validationErrors.datesData[dateString];
        }
      }
      this.formData.datesString = datesString;
      this.validationErrors.datesData = validatesDatesData;
      this.formData.datesData = newDatesData;
    },
    close() {
      this.open = false;
      this.$emit('close');
    },
    async deleteVacancy() {
      this.close();
      this.$store.dispatch('deleteVacancy', this.editedIndex);
    },
    async updateVacancy() {
      if (this.validateForm()) {
        console.log(this.editedIndex)
        console.log(this.formData);
        this.$store.dispatch('updateVacancy', {
          index: this.editedIndex,
          vacancy: this.formData,
        });
        this.close();
      } else {
        console.log("Form validation failed");
      }
    },
    validateForm() {
      let datesDataHasErrors = false;
      // Title - required, max 100 characters
      if (this.formData.title.length === 0) {
        this.validationErrors.title = ['Title is required'];
      } else if (this.formData.title.length > 100) {
        datesDataHasErrors = true
        this.validationErrors.title = ['Title cannot be more than 100 characters'];
      } else {
        this.validationErrors.title = [];
      }
      // Description - Optional, max 500 characters
      if (this.formData.description.length > 500) {
        datesDataHasErrors = true
        this.validationErrors.description = ['Description cannot be more than 500 characters'];
      } else {
        this.validationErrors.description = [];
      }
      // Dates: required, dd-mm-yyyy, minimal 1 entry, max 10.
      if (this.formData.dates.length === 0) {
        datesDataHasErrors = true
        this.validationErrors.dates = ['Dates is required'];
      } else if (this.formData.dates.length > 10) {
        datesDataHasErrors = true
        this.validationErrors.dates = ['Dates cannot be more than 10'];
      } else {
        this.validationErrors.dates = [];
      }
      for (const date of this.formData.dates) {
        let dateString = this.$options.filters.formatDate(date);

        let dateData = this.formData.datesData[dateString];
        // Starttime - required hh:mm
        if (dateData.startTime.length === 0) {
          datesDataHasErrors = true
          this.validationErrors.datesData[dateString].startTime = "Start time is required";
        } else {
          this.validationErrors.datesData[dateString].startTime = "";
        }
        // Endtime - required hh:mm, should be > starttime
        if (dateData.endTime.length === 0) {
          datesDataHasErrors = true
          this.validationErrors.datesData[dateString].endTime = "End time is required";
        } else {
          let startTime = moment(dateData.startTime, "HH:mm");
          let endTime = moment(dateData.endTime, "HH:mm");
          if (endTime.isBefore(startTime)) {
            datesDataHasErrors = true
            this.validationErrors.datesData[dateString].endTime = "End time should be greater than start time";
          } else {
            this.validationErrors.datesData[dateString].endTime = "";
          }
        }

        // Price - required, can be 0
        if (dateData.price.length === 0) {
          datesDataHasErrors = true
          this.validationErrors.datesData[dateString].price = "Price is required";
        } else {
          let price = parseFloat(dateData.price);
          if (isNaN(price)) {
            datesDataHasErrors = true
            this.validationErrors.datesData[dateString].price = "Price should be a number";
          } else {
            this.validationErrors.datesData[dateString].price = "";
          }
        }
        if (dateData.type.length === 0) {
          datesDataHasErrors = true
          this.validationErrors.datesData[dateString].type = "Type is required";
        } else {
          this.validationErrors.datesData[dateString].type = "";
        }
      }

      return !datesDataHasErrors;
    },
  },
  mounted() {
    if(this.isEditing) {
      this.loadEditedData();
    }
    this.open = true;
  }
};
</script>

<style>
.sidebar-content {
  width: 24rem !important;
}

.select, select {
  width: 100% !important;
}
</style>
