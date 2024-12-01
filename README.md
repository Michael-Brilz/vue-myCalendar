
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
      @handleDelete="handleEventDelete"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import ScheduleForm from 'vue3-mycalendar';

const schedules = ref([
    // Array containing the list of events to be displayed on the calendar
  { id: 1, title: 'Meeting', date: '2024-10-01', start: '09:00', end: '10:00', color: '#ff0000', teacher: 'Malika Heaney', room: 'Room 1' },
  { id: 2, title: 'Workshop', date: '2024-10-02', start: '13:00', end: '15:00', color: '#ff0000', teacher: 'John Doe', room: 'Room 2' },
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

// Handle the delete event action
const handleEventDelete = (id) => {
  schedules.value = schedules.value.filter(event => event.id !== id);
  console.log(`Event with ID ${id} deleted successfully`);
};
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
| popupFields       |   Array     | An array of fields to be displayed in the popup for event details, if the default Popup would be use |


## Emitted Events

| Event Name        | Payload               | Description                                               |
| ------------------|-----------------------| ----------------------------------------------------------|
| submitEvent       | EventInfo             | Triggered when a new event is added via the form.         |
| handleDelete      | EventInfo             | Is triggered when an event is deleted via the popup in the default popup.         |

 ## Slots

 The `popup-calendar` slot provides a way to define your custom popup design for viewing and interacting with event details. This slot is especially useful if you want to personalize the popup display with additional data, styles, or actions.

| Name              | Parameters                  | Description                                               |
| ------------------|-----------------------| ----------------------------------------------------------|
| default           | None                  | Custom content template for the default slot.             |
| popup-calendar    | `Number | String`     | Triggered when an event is deleted via the popup.         |


 ## Required Fields in schedules

Each event object within the schedules array must include the following standard fields:

| Field             | Typ    | Description                                             |
| ------------------|--------| --------------------------------------------------------|
| id        |   Number     | A unique identifier for the event.                        |
| title     |    String    | The title or name of the event.                           |
| date      |    String    | The date of the event (format: YYYY-MM-DD).               |
| start     |    String    | The start time of the event (format: HH:MM).              |
| end       |    String    | The end time of the event (format: HH:MM).                |
| color     |   String     |A required background color for the event (e.g., #a4d8ff). |

Additional fields, such as info or custom fields defined in additionalFields, are optional but can be added to extend the event data as needed.

## Screenshots

![App Screenshot](https://i.postimg.cc/3Jbqnwmf/Bildschirmfoto-2024-10-31-um-17-09-13.png)


## Upcoming Features
This project is actively maintained, and I plan to add exciting new features in the future.
Stay tuned for regular updates and feature releases!

## 🚀 About Me
I am a motivated junior developer looking to grow through hands-on experience in various projects. I work as a full-stack developer in the cloud department of a cybersecurity product vendor, where I am dedicated to developing secure and robust applications. My goal is to continuously expand my skills and make a significant contribution to the tech industry.

## License

[MIT](https://choosealicense.com/licenses/mit/)