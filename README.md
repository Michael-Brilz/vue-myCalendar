
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
      :popup-fields="popupFields"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import ScheduleForm from 'vue3-mycalendar';

const schedules = ref([
    // Array containing the list of events to be displayed on the calendar
  { id: 1, title: 'Meeting', date: '2024-10-01', start: '09:00', end: '10:00', teacher: 'Malika Heaney', room: 'Room 1' },
  { id: 2, title: 'Workshop', date: '2024-10-02', start: '13:00', end: '15:00', teacher: 'John Doe', room: 'Room 2' },
]);

const popupFields = ref([
  // Array defining which fields should be displayed in the event details popup
  'title', 'date', 'start', 'end', 'teacher', 'room'
]);

const additionalFields = ref([
    // Array of additional fields to be included in the event form for customization
  { id: 'teacher', label: 'Teacher', type: 'text', model: 'teacher' },
  { id: 'room', label: 'Room', type: 'select', model: 'room', options: [{ id: 1, name: 'Room 1' }, { id: 2, name: 'Room 2' }] },
]);

const labelsAndSettings = computed(() => ({
    // Object containing custom labels and settings for the calendar component
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
| popupFields       |   Array     | An array of fields to be displayed in the popup for event details. |

 ## Required Fields in schedules

Each event object within the schedules array must include the following standard fields:

id (Number): A unique identifier for the event.
title (String): The title or name of the event.
date (String, format YYYY-MM-DD): The date of the event.
start (String, format HH:MM): The start time of the event.
end (String, format HH:MM): The end time of the event.
Additional fields, such as info or custom fields defined in additionalFields, are optional but can be added to extend the event data as needed.

## Screenshots

![App Screenshot](https://i.postimg.cc/3Jbqnwmf/Bildschirmfoto-2024-10-31-um-17-09-13.png)

## 🚀 About Me
I am a motivated junior developer looking to grow through hands-on experience in various projects. I work as a full-stack developer in the cloud department of a cybersecurity product vendor, where I am dedicated to developing secure and robust applications. My goal is to continuously expand my skills and make a significant contribution to the tech industry.

## License

[MIT](https://choosealicense.com/licenses/mit/)