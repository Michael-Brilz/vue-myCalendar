
## Still under development and not suitable for productive use

# vue3-mycalendar

vue3-mycalendar is a powerful and customisable calendar component for Vue 3 that provides an easy way to view and manage calendar events and supports custom fields and customisable labels and styles.

## Installation

Install with npm

```bash
  npm install vue3-mycalendar
```

## Use:

```typescript
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
import ScheduleForm from 'vue3-mycalendar';

const schedules = ref([
  { id: 1, title: 'Meeting', date: '2024-10-01', start: '09:00', end: '10:00' },
  { id: 2, title: 'Workshop', date: '2024-10-02', start: '13:00', end: '15:00' },
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
```


## Props

| Prop              | Typ    | Description                                                        |
| ------------------|--------| ------------------------------------------------------------------ |
| schedules         |   Array     | A list of events that are displayed in the calendar.          |
| additionalFields  |   Array     | A list of additional fields for the event form.               |
| customClass       |   String    | A custom CSS class to customise the component layout.         |
| labelsAndSettings |   Object    | An object for customising the labels and text settings of the calendar component. |


## Screenshots

![App Screenshot](https://i.postimg.cc/3Jbqnwmf/Bildschirmfoto-2024-10-31-um-17-09-13.png)

## 🚀 About Me
I'm a full stack developer...

## License

[GNU](https://choosealicense.com/licenses/mit/)