import Vue from 'vue'
import moment from "moment";

Vue.filter('formatDate', (value, format) => {
  if (!value) return '';

  // format Date to  dd-MM-YYYY
  return moment(value).format('DD-MM-YYYY');
})

// time format HH:mm
Vue.filter('formatTime', (value, format) => {
  if (!value) return '';

  // format Time to HH:mm
  return moment(value, 'HH:mm').format(format || 'HH:mm');
});
