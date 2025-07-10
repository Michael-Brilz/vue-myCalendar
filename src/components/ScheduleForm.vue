<template>
  <div :class="customClass" :style="customStyles">
    <form class="form-container" @submit.prevent="addEvent">
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
          <input :id="field.id" v-model="newEvent[field.model]" :type="field.type" required class="form-input" />
        </div>
      </div>

      <div class="form-group">
        <label for="start" class="form-label">{{ labelsAndSettings.startTimeLabel }}:</label>
        <input id="start" v-model="newEvent.start" type="time" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="end" class="form-label">{{ labelsAndSettings.endTimeLabel }}:</label>
        <input id="end" v-model="newEvent.end" type="time" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="date" class="form-label">{{ labelsAndSettings.dateLabel }}:</label>
        <input id="date" v-model="newEvent.date" type="date" required class="form-input" />
      </div>

      <button type="submit" class="submit-button">
        {{ labelsAndSettings.submitButtonText }}
      </button>
    </form>

    <div class="calendar">
      <div class="navigation">
        <button class="arrow-button" @click="prevWeek">&lt;</button>
        <span class="current-week">{{ labelsAndSettings.calendarWeekLabel }} {{ getCurrentWeekNumber() }}</span>
        <button class="arrow-button" @click="nextWeek">&gt;</button>
      </div>
      <div class="hours-and-days">
        <div class="hours">
          <div class="empty-slot"></div>
          <div v-for="hour in hours" :key="hour" class="hour">{{ hour }}</div>
        </div>
        <div class="weekdays-container">
          <ul class="weekdays">
            <li v-for="(day, index) in weekdays" :key="index" class="weekday">
              <span>{{ day }}</span>
              <span>{{ getDateForWeekday(index) }}</span>
            </li>
          </ul>
          <div class="days">
            <div v-for="(day, dayIndex) in 7" :key="dayIndex" class="day"
                 @dragover.prevent
                 @drop="onDrop($event, dayIndex)">
              <div v-for="hour in hours" :key="hour" class="hour"></div>
              <div
                v-for="(event, eventIndex) in events[getDateForWeekday(dayIndex)] || []"
                :key="event.id"
                class="event"
                :style="getEventStyle(event)"
                draggable="true"
                @dragstart="onDragStart($event, event)"
                @dragend="onDragEnd"
              >
                <span :style="{ color: eventTitleColor, fontSize: eventTitleSize }">{{ event.title }}</span><br />
                <button class="info-button" @click="showEventInfo(event)">
                  <img :src="myLogoSrc" alt="info" class="small-logo" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SLOT FÜR BENUTZERDEFINIERTES POPUP -->
    <slot
      name="popup-calendar"
      v-if="$slots['popup-calendar']"
    ></slot>

    <!-- DEFAULT POPUP -->
    <Popup
      v-else
      :visible="eventInfoPopup.visible"
      :eventData="eventInfoPopup.event || {}"
      :popupFields="popupFields || []"
      closeButtonText="Close"
      :todosLabel="labelsAndSettings.todosLabel || 'To-Do'"
      :participantsLabel="labelsAndSettings.participantsLabel || 'Teammates'"
      :todoPlaceholder="placeholderSettings.todo || 'Neues To-do...'"
      :participantPlaceholder="placeholderSettings.participant || 'Teilnehmer:in hinzufügen...'"
      @close="closeEventInfoPopup"
      @handleDelete="emitDeleteEvent"
      @updateEvent="handlePopupUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue';
import Popup from './Popup.vue';
import myLogoSrc from '../assets/icons8-info.svg';
import { Field, EventInfo, LabelsAndSettings } from '../types/EventInterfaces';

const props = defineProps<{
  customClass: string;
  customStyles?: Record<string, any>;
  schedules: EventInfo[];
  additionalFields: Field[];
  weekdays?: string[];
  eventTitleColor?: string;
  eventTitleSize?: string;
  popupFields?: string[];
  labelsAndSettings?: LabelsAndSettings;
  placeholderSettings?: {
    todo?: string;
    participant?: string;
  };
}>();

const emit = defineEmits(['submitEvent', 'handleDelete', 'update-event', 'show-info']);

const weekdays = computed(() => props.weekdays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const eventTitleColor = computed(() => props.eventTitleColor || '#000');
const eventTitleSize = computed(() => props.eventTitleSize || '16px');
const labelsAndSettings = computed(() => ({
  startTimeLabel: props.labelsAndSettings?.startTimeLabel || 'Start Time',
  endTimeLabel: props.labelsAndSettings?.endTimeLabel || 'End Time',
  dateLabel: props.labelsAndSettings?.dateLabel || 'Date',
  submitButtonText: props.labelsAndSettings?.submitButtonText || 'Add Entry',
  calendarWeekLabel: props.labelsAndSettings?.calendarWeekLabel || 'CW',
  todosLabel: props.labelsAndSettings?.todosLabel,
  participantsLabel: props.labelsAndSettings?.participantsLabel,
}));

const placeholderSettings = computed(() => props.placeholderSettings || {});

const schedules = ref(props.schedules);
const additionalFields = ref(props.additionalFields);
const hours = ref(Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00'));

const events = ref<Record<string, EventInfo[]>>({});
const newEvent = ref<Partial<EventInfo>>({ start: '', end: '', date: '', color: '' });
const eventInfoPopup = ref<{ visible: boolean; event: EventInfo | {} }>({ visible: false, event: {} });
const currentWeekOffset = ref(0);
const draggedEvent = ref<EventInfo | null>(null);

const addEvent = () => {
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

const handlePopupUpdate = (updated: EventInfo) => {
  emit('update-event', updated);
};

const loadEvents = () => {
  if (!additionalFields.value.length || !schedules.value.length) return;
  events.value = {};
  schedules.value.forEach((event) => {
    const eventDate = event.date;
    if (!events.value[eventDate]) events.value[eventDate] = [];
    events.value[eventDate].push(event);
  });
};
watchEffect(loadEvents);

const getDateForWeekday = (weekdayIndex: number) => {
  const today = new Date();
  const currentWeekday = today.getDay();
  const distance = weekdayIndex + 1 - currentWeekday + currentWeekOffset.value * 7;
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + distance);
  return resultDate.toISOString().substring(0, 10);
};

const getCurrentWeekNumber = () => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDays = (today.getTime() - startOfYear.getTime()) / 86400000 + currentWeekOffset.value * 7;
  return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
};

const prevWeek = () => currentWeekOffset.value -= 1;
const nextWeek = () => currentWeekOffset.value += 1;

const getEventStyle = (event: EventInfo) => {
  const start = parseTime(event.start);
  const end = parseTime(event.end);
  const top = (start.totalMinutes * 40) / 60;
  const height = ((end.totalMinutes - start.totalMinutes) * 40) / 60;
  return {
    backgroundColor: event.color || '#a4d8ff',
    top: `${top}px`,
    height: `${height}px`,
    position: 'absolute' as const,
    left: 0,
    right: 0,
    zIndex: 1,
  };
};

const parseTime = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return { h, m, totalMinutes: h * 60 + m };
};

const getDurationInMinutes = (start: string, end: string) => parseTime(end).totalMinutes - parseTime(start).totalMinutes;

const calculateNewEnd = (start: string, duration: number) => {
  const total = parseTime(start).totalMinutes + duration;
  const h = Math.floor(total / 60).toString().padStart(2, '0');
  const m = (total % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const onDragStart = (_event: DragEvent, event: EventInfo) => {
  draggedEvent.value = event;
};

const onDragEnd = () => {
  draggedEvent.value = null;
};

const onDrop = (e: DragEvent, dayIndex: number) => {
  if (!draggedEvent.value) return;
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const dropY = e.clientY - rect.top;
  const minutesPerPixel = 60 / 40;
  const newStartMinutes = Math.round(dropY * minutesPerPixel / 15) * 15;
  const newStart = `${String(Math.floor(newStartMinutes / 60)).padStart(2, '0')}:${String(newStartMinutes % 60).padStart(2, '0')}`;
  const duration = getDurationInMinutes(draggedEvent.value.start, draggedEvent.value.end);
  const newEnd = calculateNewEnd(newStart, duration);
  const newDate = getDateForWeekday(dayIndex);

  const updatedEvent = {
    ...draggedEvent.value,
    start: newStart,
    end: newEnd,
    date: newDate,
  };

  emit('update-event', updatedEvent);

  const oldDate = draggedEvent.value.date;
  events.value[oldDate] = events.value[oldDate]?.filter(ev => ev.id !== draggedEvent.value!.id) || [];
  events.value[newDate] = [...(events.value[newDate] || []), updatedEvent];
  draggedEvent.value = null;
};

const showEventInfo = (event: EventInfo) => {
  eventInfoPopup.value.event = event;
  eventInfoPopup.value.visible = true;

  emit('show-info', event);
};

const closeEventInfoPopup = () => {
  eventInfoPopup.value.visible = false;
};

const emitDeleteEvent = (eventId: number) => emit('handleDelete', eventId);

onMounted(() => {
  props.additionalFields.forEach(field => {
    newEvent.value[field.model] = '';
  });
});
</script>
  
<style>
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
    height: 40px;
  }

  .weekday {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    margin-bottom: 13px;
  }

  .calendar {
    display: flex;
    flex-direction: column;
  }

  .hours-and-days {
    display: flex;
    align-items: stretch;
  }

  .hours {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
    width: 50px;
    height: 100%;
  }

  .hours .hour {
    min-height: 40px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    flex-grow: 1;
  }

  .weekdays-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .days {
    display: flex;
    flex-grow: 1;
  }

  .day {
    flex: 1;
    border-left: 1px solid #ccc;
    position: relative;
  }

  .day .hour {
    min-height: 40px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    flex-grow: 1;
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
    margin-bottom: 2rem;
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
  