<template>
    <ScheduleForm 
      :schedules="schedules" 
      :additional-fields="additionalFields" 
      custom-class="customize-schedule-form"
      :labels-and-settings="labelsAndSettings"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import ScheduleForm from './ScheduleForm.vue';

const schedules = ref([
  { id: 1, title: 'Meeting', date: '2024-10-01', start: '09:00', end: '10:00', teacher: 'Malika Heaney', room: 'Room 1' },
  { id: 2, title: 'Workshop', date: '2024-10-02', start: '13:00', end: '15:00', teacher: 'John Doe', room: 'Room 2' },
]);

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
</script>

<style scoped lang="scss">
.customize-schedule-form {
  --form-bg-color: #F2F2F2;
  --button-bg-color: #009688;
  --label-color: #123456;
}
</style>