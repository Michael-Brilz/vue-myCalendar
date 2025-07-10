<template>
  <div class="wrapper">
    <ScheduleForm 
      :schedules="schedules" 
      :additional-fields="additionalFields" 
      custom-class="customize-schedule-form"
      :labels-and-settings="labelsAndSettings"
      :popup-fields="popupFields"
      @deleteEvent="handleDeleteEvent"
      @update-event="handleUpdateEvent"
      @show-info="openCustomPopup"
    >
    <template #popup-calendar>
    <div v-if="customPopup.visible" class="test-popup">
      <div class="test-popup-box">
        <h3>🎉 My own Popup!</h3>
        <p><strong>{{ customPopup.event?.title }}</strong></p>
        <p>{{ customPopup.event?.date }} — {{ customPopup.event?.start }} to {{ customPopup.event?.end }}</p>
        <button @click="closeCustomPopup">Close</button>
      </div>
    </div>
</template>
    </ScheduleForm>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ScheduleForm from './ScheduleForm.vue';
import { EventInfo } from '../types/EventInterfaces';

const schedules = ref([
  { id: 1, title: 'Meeting', date: '2025-07-04', start: '09:00', end: '10:00', teacher: 'Malika Heaney', room: 'Room 1', color: '#e2Be33' },
  { id: 2, title: 'Workshop', date: '2025-07-04', start: '13:00', end: '15:00', teacher: 'John Doe', room: 'Room 2', color: '#33C3FF' },
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

const customPopup = ref<{ visible: boolean; event: EventInfo | null }>({
  visible: false,
  event: null
});

const openCustomPopup = (event: EventInfo) => {
  customPopup.value.visible = true;
  customPopup.value.event = event;
};

const closeCustomPopup = () => {
  customPopup.value.visible = false;
};

const handleDeleteEvent = (eventId) => {
  schedules.value = schedules.value.filter(event => event.id !== eventId);
};

const testPopup = ref<{ visible: boolean; event: EventInfo | null }>({
  visible: true,
  event: schedules.value[0],
});

const handleUpdateEvent = (event: EventInfo) => {
  const index = schedules.value.findIndex(e => e.id === event.id);
  if (index !== -1) {
    schedules.value[index] = event;
  }
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