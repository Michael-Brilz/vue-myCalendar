import { createApp } from 'vue';
import App from './components/App.vue';
import './styles/theme.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faTrash, faTimes, faPlus, faUserPlus,
  faCalendarDays, faLocationDot, faLink, faUser, faUsers, faListCheck,
} from '@fortawesome/free-solid-svg-icons';

library.add(faPlus, faTimes, faTrash, faUserPlus, faCalendarDays, faLocationDot, faLink, faUser, faUsers, faListCheck);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');