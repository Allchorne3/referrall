import { createApp } from 'vue';
import ReferralsList from './components/ReferralsList.vue';

document.addEventListener('DOMContentLoaded', () => {
	createApp({
	  components: {
		ReferralsList
	  }
	}).mount('#app');
})
