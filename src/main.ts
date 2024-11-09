import { createApp } from 'vue';
import App from './components/App.vue';
import ScheduleForm from './components/ScheduleForm.vue';

const app = createApp(App);

app.component('ScheduleForm', ScheduleForm);

app.mount('#app');