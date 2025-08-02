const moment = require("moment") // For date formatting

import { createApp } from 'vue';
import GamesList from './components/GamesList.vue';

document.addEventListener('DOMContentLoaded', () => {
	// Get the current yeaer
	document.getElementById('is-year').innerHTML = moment().year();

	createApp({
	  components: {
		GamesList
	  }
	}).mount('#app');
})
