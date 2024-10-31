<template>
  <div :class="customClass" :style="{ ...customStyles, ...componentStyle}">
    <form class="form-container" @submit.prevent="addEvent">
      <!-- Dynamic fields-->
      <div v-for="field in additionalFields" :key="field.id" class="form-group">
        <label :for="field.id" class="form-label">{{ field.label }}:</label>
        <div v-if="field.type === 'select'">
          <select :id="field.id" v-model="newEvent[field.model]" required class="form-select">
            <option v-for="option in field.options" :key="option.id" :value="option">
              {{ option.name || `${option.first_name} ${option.last_name}` }}
            </option>
          </select>
        </div>
        <div v-else>
          <input :id="field.id" v-model="newEvent[field.model]" :type="field.type" required class="form-input"/>
        </div>
      </div>

      <!-- Fixed fields -->
      <div class="form-group">
        <label for="start" class="form-label">{{ labelsAndSettings.startTimeLabel || 'Start Time' }}:</label>
        <input id="start" v-model="newEvent.start" type="time" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="end" class="form-label">{{ labelsAndSettings.endTimeLabel || 'End Time' }}:</label>
        <input id="end" v-model="newEvent.end" type="time" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="date" class="form-label">{{ labelsAndSettings.dateLabel || 'Date' }}:</label>
        <input id="date" v-model="newEvent.date" type="date" required class="form-input" />
      </div>

      <button type="submit" :disabled="Boolean(events.processing)" class="submit-button">
        {{ labelsAndSettings.submitButtonText || 'Add Entry' }}
      </button>
    </form>

    <div class="calendar">
      <div class="navigation">
        <button class="arrow-button" @click="prevWeek">&lt;</button>
        <span class="current-week">{{ labelsAndSettings.calendarWeekLabel || 'CW' }} {{ getCurrentWeekNumber() }}</span>
        <button class="arrow-button" @click="nextWeek">&gt;</button>
      </div>
      <div class="hours-and-days">
        <div class="hours">
          <div class="empty-slot"></div>
          <div v-for="hour in hours" :key="hour" class="hour">
            {{ hour }}
          </div>
        </div>
        <div class="weekdays-container">
          <ul class="weekdays">
            <li v-for="(day, index) in weekdays" :key="index" class="weekday">
              <span>{{ day }}</span>
              <span>{{ getDateForWeekday(index) }}</span>
            </li>
          </ul>
          <div class="days">
            <div v-for="(day, dayIndex) in 7" :key="dayIndex" class="day">
              <div v-for="hour in hours" :key="hour" class="hour"></div>
              <div v-for="(event, eventIndex) in events[getDateForWeekday(dayIndex)] || []" 
                   :key="event.id" class="event" :style="getEventStyle(event)">
                   <span :style="{ color: eventTitleColor, fontSize: eventTitleSize }">{{ event.title }}</span><br />
                   <button class="info-button" @click="showEventInfo(event)">
                      <img :src="myLogoSrc" alt="my-logo" class="small-logo" />
                   </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Popup :visible="eventInfoPopup.visible" closeButtonText="Close" @close="closeEventInfoPopup">
      <!-- Content of the popup as a slot -->
      <template v-if="isEventInfo(eventInfoPopup.event)">
        <p><strong>Subject:</strong> {{ eventInfoPopup.event.title }}</p>
        <p><strong>Teacher:</strong> {{ eventInfoPopup.event.teacher }}</p>
        <p><strong>Start Time:</strong> {{ eventInfoPopup.event.start }}</p>
        <p><strong>End Time:</strong> {{ eventInfoPopup.event.end }}</p>
        <p><strong>Date:</strong> {{ eventInfoPopup.event.date }}</p>
        <p><strong>Info:</strong> {{ eventInfoPopup.event.info }}</p>
        <button class="remove-button" @click="removeEventById(eventInfoPopup.event.id)">
          Delete Event
        </button>
      </template>
      <template v-else>
        <p>No event information available.</p>
      </template>
    </Popup>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed, watchEffect, onMounted } from 'vue';
import Popup from './Popup.vue';
import myLogoSrc from '../assets/icons8-info.svg';
import { FieldOption, Field, EventInfo, LabelsAndSettings } from '@/types/EventInterfaces';

const props = defineProps<{
customClass: { type: String, default: '' },
customStyles: { type: Object, default: () => ({}) },
schedules: EventInfo[];
additionalFields: Field[];
weekdays?: string[];
eventTitleColor?: string;
eventTitleSize?: string;
labelsAndSettings?: LabelsAndSettings;
}>();

const emit = defineEmits(['submitEvent']);

const weekdays = computed(() => props.weekdays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const eventTitleColor = computed(() => props.eventTitleColor || '#000');
const eventTitleSize = computed(() => props.eventTitleSize || '16px');
const labelsAndSettings = computed(() => ({
startTimeLabel: props.labelsAndSettings?.startTimeLabel || 'Start Time',
endTimeLabel: props.labelsAndSettings?.endTimeLabel || 'End Time',
dateLabel: props.labelsAndSettings?.dateLabel || 'Date',
submitButtonText: props.labelsAndSettings?.submitButtonText || 'Add Entry',
calendarWeekLabel: props.labelsAndSettings?.calendarWeekLabel || 'CW',
}));

// Ref variables
const schedules = ref(props.schedules);
const additionalFields = ref(props.additionalFields);
const hours = ref([
'00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', 
'08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
'16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
]);

const events = ref<Record<string, EventInfo[]>>({});
const newEvent = ref<Partial<EventInfo>>({ start: '', end: '', date: '', color: '' });
const eventInfoPopup = ref<{ visible: boolean; event: EventInfo | {} }>({ visible: false, event: {} });
const currentWeekOffset = ref(0);

// Helper function to check if event is of type EventInfo
function isEventInfo(event: any): event is EventInfo {
  return (event as EventInfo).title !== undefined;
}

const addEvent = async () => {
const event: Partial<EventInfo> = {
  start: newEvent.value.start,
  end: newEvent.value.end,
  date: newEvent.value.date,
  info: newEvent.value.info,
  color: newEvent.value.color,
};

props.additionalFields.forEach((field) => {
  event[field.model] = newEvent.value[field.model];
});

emit('submitEvent', event as EventInfo);

Object.keys(newEvent.value).forEach((key) => {
  newEvent.value[key as keyof EventInfo] = '';
});
};

// Styling as a computed property
const componentStyle = computed(() => ({
'--form-bg-color': '#fff',
'--form-padding': '20px',
'--form-border-radius': '10px',
'--form-border': '1px solid #333',
'--label-color': '#445269',
'--label-font-weight': '500',
'--input-border': '1px solid #445269',
'--input-border-radius': '5px',
'--input-padding': '10px',
'--input-font-size': '15px',
'--button-bg-color': '#445269',
'--button-hover-bg-color': '#333',
'--button-color': '#fff',
'--button-padding': '12px 20px',
'--button-border-radius': '8px',
}));

// Load and assign events
const loadEvents = () => {
if (!additionalFields.value.length || !schedules.value.length) return;

events.value = {}; // Events-Objekt leeren

schedules.value.forEach((event) => {
  const eventDate = event.date;

  if (!events.value[eventDate]) {
    events.value[eventDate] = [];
  }
  events.value[eventDate].push(event);
});
};

watchEffect(loadEvents);

// Function to remove an event
const removeEventById = (eventId: number | string) => {
for (const date in events.value) {
  events.value[date] = events.value[date].filter(event => event.id !== eventId);
}
closeEventInfoPopup();
};

// Helper for calculating the date for each day of the week
const getDateForWeekday = (weekdayIndex: number) => {
const today = new Date();
const currentWeekday = today.getDay();
const distance = weekdayIndex + 1 - currentWeekday + currentWeekOffset.value * 7;
const resultDate = new Date(today);
resultDate.setDate(today.getDate() + distance);
return resultDate.toISOString().substring(0, 10);
};

// Helper for calculating the calendar week
const getCurrentWeekNumber = () => {
const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 1);
const pastDaysOfYear = (today.getTime() - startOfYear.getTime()) / 86400000 + currentWeekOffset.value * 7;
return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
};

// Navigation between weeks
const prevWeek = () => currentWeekOffset.value -= 1;
const nextWeek = () => currentWeekOffset.value += 1;

// Styling of an event based on start and end time
const getEventStyle = (event: EventInfo) => {
const startHour = parseInt(event.start.substring(0, 2));
const startMinutes = parseInt(event.start.substring(3, 5));
const endHour = parseInt(event.end.substring(0, 2));
const endMinutes = parseInt(event.end.substring(3, 5));

const startTotalMinutes = startHour * 60 + startMinutes;
const endTotalMinutes = endHour * 60 + endMinutes;

const topPosition = (startTotalMinutes * 40) / 60;
let height = ((endTotalMinutes - startTotalMinutes) * 40) / 60;

if (endMinutes === 0) height += 40;

return {
  backgroundColor: event.color,
  top: `${topPosition}px`,
  height: `${height}px`,
  position: 'absolute' as 'absolute',
  left: 0,
  right: 0,
  zIndex: 1,
};
};

const showEventInfo = (event: EventInfo) => {
eventInfoPopup.value.event = event;
eventInfoPopup.value.visible = true;
};

const closeEventInfoPopup = () => eventInfoPopup.value.visible = false;

onMounted(() => {
props.additionalFields.forEach((field) => {
  newEvent.value[field.model] = '';
});
});
</script>
  
<style>
  .customize-schedule-form {
    --form-bg-color: #ffffff;
    --form-padding: 20px;
    --form-border-radius: 10px;
    --form-border: 1px solid #333;
    --label-color: #445269;
    --label-font-weight: 500;
    --input-border: 1px solid #445269;
    --input-border-radius: 5px;
    --input-padding: 10px;
    --input-font-size: 15px;
    --button-bg-color: #445269;
    --button-hover-bg-color: #333;
    --button-color: #fff;
    --button-padding: 12px 20px;
    --button-border-radius: 8px;
  }
  
  .small-logo {
  width: 20px;
  height: 20px;
  }

  .form-container {
    display: flex;
    flex-wrap: wrap;
    gap: var(--form-gap, 1rem);
    background-color: var(--form-bg-color);
    padding: var(--form-padding);
    border-radius: var(--form-border-radius);
    border: var(--form-border);
    margin-bottom: 20px;
  }
  
  .form-group {
    flex: 1;
    min-width: 200px;
    margin-bottom: 10px;
  }
  
  .form-label {
    display: block;
    color: var(--label-color);
    font-weight: var(--label-font-weight);
    margin-bottom: 4px;
  }
  
  .form-input,
  .form-select {
    width: 100%;
    height: var(--input-height, 40px);
    padding: var(--input-padding);
    font-size: var(--input-font-size);
    border: var(--input-border);
    border-radius: var(--input-border-radius);
    box-sizing: border-box;
    appearance: none;
  }
  
  .submit-button {
    background-color: var(--button-bg-color);
    color: var(--button-color);
    padding: var(--button-padding);
    border-radius: var(--button-border-radius);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1rem;
  }
  
  .submit-button:hover {
    background-color: var(--button-hover-bg-color);
  }
  
  .weekdays {
    list-style-type: none;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    border-bottom: 1px solid #ccc;
    margin: 0;
    height: 100%;
  }
  
  .weekday {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
  }
  
  .calendar {
    display: flex;
    flex-direction: column;
  }
  
  .hours-and-days {
    display: flex;
  }
  
  .hours {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 50px;
  }
  
  .hours .hour {
    height: 40px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  
  .weekdays-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .days {
    display: flex;
  }
  
  .day {
    flex: 1;
    border-left: 1px solid #ccc;
    position: relative;
  }
  
  .day .hour {
    height: 40px;
    border-bottom: 1px solid #ccc;
    position: relative;
    box-sizing: border-box;
  }
  
  .event {
    background-color: #a4d8ff;
    padding: 2px;
    font-size: 12px;
    border-radius: 8px;
    width: 95%;
    box-sizing: border-box;
    position: absolute;
  }
  
  .remove-button {
    background-color: #e53e3e;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
  }
  
  .empty-slot {
    height: 40px;
  }
  
  .navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .arrow-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
    margin: 0 1rem;
  }
  
  .current-week {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .info-button {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: transparent;
    border: none;
    color: blue;
    font-weight: bold;
    cursor: pointer;
  }
  
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .popup-content {
    background-color: white;
    padding: 1rem;
    border-radius: 5px;
    max-width: 400px;
    width: 100%;
  }
  
  .close-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 1rem;
  }
  </style>
  