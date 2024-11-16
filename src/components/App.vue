<template>
  <div class="wrapper">
    <ScheduleForm 
      :schedules="schedules" 
      :additional-fields="additionalFields" 
      custom-class="customize-schedule-form"
      :labels-and-settings="labelsAndSettings"
      :popup-fields="popupFields"
      @deleteEvent="handleDeleteEvent"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ScheduleForm from './ScheduleForm.vue';

const schedules = ref([
  { id: 1, title: 'Meeting', date: '2024-11-04', start: '09:00', end: '10:00', teacher: 'Malika Heaney', room: 'Room 1', color: '#e2Be33' },
  { id: 2, title: 'Workshop', date: '2024-11-07', start: '13:00', end: '15:00', teacher: 'John Doe', room: 'Room 2', color: '#33C3FF' },
]);

const popupFields = ref(['title', 'date', 'start', 'end']);

const additionalFields = ref([
  { id: 'teacher', label: 'Teacher', type: 'text', model: 'teacher' },
  { id: 'room', label: 'Room', type: 'select', model: 'room', options: [{ id: 1, name: 'Room 1' }, { id: 2, name: 'Room 2' }] },
]);

const labelsAndSettings = computed(() => ({
  startTimeLabel: 'Start Time',    
  endTimeLabel: 'End Time',        
  dateLabel: 'Date',               
  submitButtonText: 'Add Event',   
  calendarWeekLabel: 'Week',       
}));

const handleDeleteEvent = (eventId) => {
  schedules.value = schedules.value.filter(event => event.id !== eventId);
};

</script>

<style scoped lang="scss">
.customize-schedule-form {
  --form-padding: 20px;
  --form-border-radius: 10px;
  --form-border: 1px solid #333;
  --label-color: #445269;
  --label-font-weight: 500;
  --input-border: 1px solid #445269;
  --input-border-radius: 5px;
  --input-padding: 10px;
  --input-font-size: 15px;
  --button-bg-color: #18e197;
  --button-hover-bg-color: #333;
  --button-color: #fff;
  --button-padding: 12px 20px;
  --button-border-radius: 8px;
}

.wrapper{
  padding: 20px;
}
</style>