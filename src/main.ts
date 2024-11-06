import { createApp } from 'vue';
import App from './components/App.vue';
import MyCalendar from './components/ScheduleForm.vue';

// Vue App erstellen und mounten
const app = createApp(App);

// Register the component globally if you want to use it in any component
app.component('ScheduleForm', MyCalendar);

app.mount('#app');