<template>
  <div :class="['calendar-theme', customClass, { dark: isDark }]" :style="customStyles">

    <!-- CUSTOM FORM SLOT -->
    <slot
        name="form"
        :new-event="newEvent"
        :add-event="addEvent"
        :additional-fields="additionalFields"
        :labels="labelsAndSettings"
        :reset-form="resetForm"
    >
      <!-- DEFAULT FORM -->
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
            <input
                :id="field.id"
                v-model="newEvent[field.model]"
                :type="field.type"
                required
                class="form-input"
            />
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
    </slot>

    <!-- CALENDAR -->
    <div class="calendar">
      <div class="navigation">
        <button type="button" class="arrow-button" @click="prevWeek">&lt;</button>
        <span class="current-week">{{ labelsAndSettings.calendarWeekLabel }} {{ getCurrentWeekNumber() }}</span>
        <button type="button" class="arrow-button" @click="nextWeek">&gt;</button>
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
            <div
                v-for="(day, dayIndex) in 7"
                :key="dayIndex"
                class="day"
                @dragover.prevent
                @drop="onDrop($event, dayIndex)"
            >
              <div v-for="hour in hours" :key="hour" class="hour"></div>

              <div
                  v-for="event in events[getDateForWeekday(dayIndex)] || []"
                  :key="event.id"
                  class="event"
                  :style="getEventStyle(event)"
                  draggable="true"
                  @dragstart="onDragStart($event, event)"
                  @dragend="onDragEnd"
              >
                <span :style="{ color: eventTitleColor, fontSize: eventTitleSize }">
                  {{ event.title }}
                </span>
                <br />
                <button type="button" class="info-button" @click="showEventInfo(event)">
                  <img :src="myLogoSrc" alt="info" class="small-logo" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CUSTOM POPUP SLOT -->
    <slot name="popup-calendar" v-if="$slots['popup-calendar']"></slot>

    <!-- DEFAULT POPUP -->
    <Popup
        v-else
        :visible="popupVisible"
        :eventData="popupEvent"
        :popupFields="popupFields || []"
        closeButtonText="Close"
        :todosLabel="labelsAndSettings.todosLabel || 'To-Do'"
        :participantsLabel="labelsAndSettings.participantsLabel || 'Teammates'"
        :todos="popupEvent?.todos || []"
        :participants="popupEvent?.participants || []"
        :todoPlaceholder="placeholderSettings.todo || 'New To-do...'"
        :participantPlaceholder="placeholderSettings.participant || 'Add Participant...'"
        @update:todos="(val) => emit('update:todos', val)"
        @update:participants="(val) => emit('update:participants', val)"
        @close-popup="closeEventInfoPopup"
        @handle-delete="emitDeleteEvent"
        @update-event="handlePopupUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, useSlots } from 'vue';
import Popup from './Popup.vue';
import myLogoSrc from '../assets/icons8-info.svg';
import { Field, EventInfo, LabelsAndSettings } from '@/types/EventInterfaces';

// ============================================================================
// Props
// ============================================================================

const props = withDefaults(
    defineProps<{
      schedules: EventInfo[];
      additionalFields: Field[];
      customClass?: string;
      customStyles?: Record<string, any>;
      weekdays?: string[];
      eventTitleColor?: string;
      eventTitleSize?: string;
      popupFields?: string[];
      labelsAndSettings?: LabelsAndSettings;
      placeholderSettings?: {
        todo?: string;
        participant?: string;
      };
      popupVisible?: boolean;
      popupEvent?: EventInfo | null;
    }>(),
    {
      customClass: '',
      customStyles: () => ({}),
      weekdays: () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      eventTitleColor: '#000',
      eventTitleSize: '16px',
      popupFields: () => [],
      labelsAndSettings: () => ({
        startTimeLabel: 'Start Time',
        endTimeLabel: 'End Time',
        dateLabel: 'Date',
        submitButtonText: 'Add Entry',
        calendarWeekLabel: 'CW',
      }),
      placeholderSettings: () => ({}),
      popupVisible: false,
      popupEvent: null,
    }
);

// ============================================================================
// Emits
// ============================================================================

const emit = defineEmits<{
  'submit-event': [event: EventInfo];
  'handle-delete': [eventId: number];
  'update-event': [event: EventInfo];
  'show-info': [event: EventInfo];
  'close-popup': [];
  'update:todos': [payload: { todos: string[]; eventId: number }];
  'update:participants': [payload: { participants: string[]; eventId: number }];
}>();

// ============================================================================
// Slots
// ============================================================================

const slots = useSlots();

// ============================================================================
// State
// ============================================================================

const isDark = ref(false);
const events = ref<Record<string, EventInfo[]>>({});
const newEvent = ref<Partial<EventInfo>>({
  start: '',
  end: '',
  date: '',
  color: '',
  title: '',
  description: '',
});
const currentWeekOffset = ref(0);
const draggedEvent = ref<EventInfo | null>(null);

const hours = ref(
    Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00')
);

// ============================================================================
// Computed
// ============================================================================

const weekdays = computed(() => props.weekdays);
const eventTitleColor = computed(() => props.eventTitleColor);
const eventTitleSize = computed(() => props.eventTitleSize);
const additionalFields = computed(() => props.additionalFields);

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
const popupVisible = computed(() => props.popupVisible);
const popupEvent = computed(() => props.popupEvent);

// ============================================================================
// Methods - Form
// ============================================================================

/**
 * Reset form to initial state
 */
const resetForm = () => {
  newEvent.value = {
    start: '',
    end: '',
    date: '',
    color: '',
    title: '',
    description: '',
  };

  // Reset additional field models
  props.additionalFields.forEach((field) => {
    (newEvent.value as any)[field.model] = '';
  });
};

/**
 * Add/Submit event
 */
const addEvent = (externalEvent?: Partial<EventInfo>) => {
  const eventData = externalEvent || newEvent.value;

  const event: Partial<EventInfo> = {
    title: eventData.title,
    start: eventData.start,
    end: eventData.end,
    date: eventData.date,
    info: eventData.info,
    color: eventData.color,
    description: eventData.description,
  };

  // Add additional field values
  props.additionalFields.forEach((field) => {
    event[field.model] = eventData[field.model];
  });

  emit('submit-event', event as EventInfo);
  resetForm();
};

// ============================================================================
// Methods - Calendar Navigation
// ============================================================================

const getDateForWeekday = (weekdayIndex: number): string => {
  const today = new Date();
  const currentWeekday = today.getDay();
  const distance = weekdayIndex + 1 - currentWeekday + currentWeekOffset.value * 7;
  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + distance);
  return resultDate.toISOString().substring(0, 10);
};

const getCurrentWeekNumber = (): number => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDays = (today.getTime() - startOfYear.getTime()) / 86400000 + currentWeekOffset.value * 7;
  return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
};

const prevWeek = () => {
  currentWeekOffset.value -= 1;
};

const nextWeek = () => {
  currentWeekOffset.value += 1;
};

// ============================================================================
// Methods - Event Styling
// ============================================================================

const parseTime = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return { h, m, totalMinutes: h * 60 + m };
};

const getEventStyle = (event: EventInfo) => {
  const start = parseTime(event.start);
  const end = parseTime(event.end);
  const top = (start.totalMinutes * 40) / 60;
  const height = ((end.totalMinutes - start.totalMinutes) * 40) / 60;

  return {
    backgroundColor: event.color || 'var(--calendar-primary-color)',
    top: `${top}px`,
    height: `${height}px`,
    position: 'absolute' as const,
    left: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 'var(--event-border-radius)',
  };
};

// ============================================================================
// Methods - Drag & Drop
// ============================================================================

const getDurationInMinutes = (start: string, end: string): number => {
  return parseTime(end).totalMinutes - parseTime(start).totalMinutes;
};

const calculateNewEnd = (start: string, duration: number): string => {
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
  const newStartMinutes = Math.round((dropY * minutesPerPixel) / 15) * 15;

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

  // Update local state
  const oldDate = draggedEvent.value.date;
  events.value[oldDate] = events.value[oldDate]?.filter((ev) => ev.id !== draggedEvent.value!.id) || [];
  events.value[newDate] = [...(events.value[newDate] || []), updatedEvent];
  draggedEvent.value = null;
};

// ============================================================================
// Methods - Popup
// ============================================================================

const showEventInfo = (event: EventInfo) => {
  emit('show-info', event);
};

const closeEventInfoPopup = () => {
  emit('close-popup');
};

const emitDeleteEvent = (eventId: number) => {
  emit('handle-delete', eventId);
};

const handlePopupUpdate = (updated: EventInfo) => {
  emit('update-event', updated);
};

// ============================================================================
// Watchers
// ============================================================================

const loadEvents = () => {
  if (!props.schedules.length) {
    events.value = {};
    return;
  }

  events.value = {};
  props.schedules.forEach((event) => {
    const eventDate = event.date;
    if (!events.value[eventDate]) {
      events.value[eventDate] = [];
    }
    events.value[eventDate].push(event);
  });
};

watchEffect(loadEvents);

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  // Init additional field models
  props.additionalFields.forEach((field) => {
    (newEvent.value as any)[field.model] = '';
  });

  // Init theme from system preference
  const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (mq?.matches) {
    isDark.value = true;
  }
});

// ============================================================================
// Expose (for external access via ref)
// ============================================================================

defineExpose({
  newEvent,
  addEvent,
  resetForm,
});
</script>

<style>
/* ============================================================================
   LIGHT THEME DEFAULTS
============================================================================ */
.calendar-theme {
  /* Core */
  --body-bg-color: #ffffff;
  --body-text-color: #000000;

  /* Forms */
  --form-bg-color: #ffffff;
  --form-padding: 1rem;
  --form-border-radius: 8px;
  --form-border: 1px solid #ccc;
  --form-gap: 1rem;

  --label-color: #333333;
  --label-font-weight: bold;

  --input-height: 40px;
  --input-padding: 0.5rem;
  --input-font-size: 1rem;
  --input-border: 1px solid #ccc;
  --input-border-radius: 6px;
  --input-bg-color: #ffffff;
  --input-color: #000000;

  /* Accent */
  --accent-color: #007bff;
  --accent-contrast: #ffffff;

  /* Calendar + Grid */
  --calendar-primary-color: #a4d8ff;
  --grid-border-color: #cccccc;

  /* Buttons */
  --button-bg-color: var(--accent-color);
  --button-hover-bg-color: #0056b3;
  --button-color: var(--accent-contrast);
  --button-padding: 0.6rem 1rem;
  --button-border-radius: 6px;

  /* Event */
  --event-border-radius: 8px;

  /* Nav / Week */
  --arrow-button-bg: var(--accent-color);
  --arrow-button-color: var(--accent-contrast);
  --current-week-color: #000000;

  /* Popup */
  --popup-bg: #ffffff;
  --popup-overlay-bg: rgba(0, 0, 0, 0.5);
  --popup-border-radius: 5px;

  /* Danger */
  --danger-bg: #e53e3e;
  --danger-text: #ffffff;

  color: var(--body-text-color);
}

/* ============================================================================
   DARK THEME
============================================================================ */
.calendar-theme.dark {
  --body-text-color: #ffffff;

  --form-bg-color: #1c1c1c;
  --form-border: 1px solid rgba(255, 255, 255, 0.1);
  --label-color: #ffffff;

  --input-bg-color: #1e1e1e;
  --input-border: 1px solid rgba(255, 255, 255, 0.15);
  --input-color: #ffffff;

  --accent-color: #D2F7D8;
  --accent-contrast: #121212;

  --calendar-primary-color: #D2F7D8;
  --grid-border-color: rgba(255, 255, 255, 0.12);

  --button-bg-color: var(--accent-color);
  --button-hover-bg-color: #b2e7c0;
  --button-color: var(--accent-contrast);

  --current-week-color: #ffffff;

  --popup-bg: rgba(18, 18, 18, 0.95);
  --popup-overlay-bg: rgba(0, 0, 0, 0.7);
}

/* ============================================================================
   SYSTEM DARK PREFERENCE
============================================================================ */
@media (prefers-color-scheme: dark) {
  .calendar-theme:not(.dark):not(.light) {
    --body-bg-color: #121212;
    --body-text-color: #ffffff;

    --form-bg-color: #1c1c1c;
    --form-border: 1px solid rgba(255, 255, 255, 0.1);
    --label-color: #ffffff;

    --input-bg-color: #1e1e1e;
    --input-border: 1px solid rgba(255, 255, 255, 0.15);
    --input-color: #ffffff;

    --accent-color: #D2F7D8;
    --accent-contrast: #121212;

    --calendar-primary-color: #D2F7D8;
    --grid-border-color: rgba(255, 255, 255, 0.12);

    --button-bg-color: var(--accent-color);
    --button-hover-bg-color: #b2e7c0;
    --button-color: var(--accent-contrast);

    --current-week-color: #ffffff;

    --popup-bg: rgba(18, 18, 18, 0.95);
    --popup-overlay-bg: rgba(0, 0, 0, 0.7);
  }
}

/* ============================================================================
   COMPONENT STYLES
============================================================================ */

/* Info Logo */
.calendar-theme .small-logo {
  width: 20px;
  height: 20px;
}

/* Form Container */
.calendar-theme .form-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--form-gap);
  background-color: var(--form-bg-color);
  padding: var(--form-padding);
  border-radius: var(--form-border-radius);
  border: var(--form-border);
  margin-bottom: 20px;
}

.calendar-theme .form-group {
  flex: 1;
  min-width: 200px;
  margin-bottom: 10px;
}

.calendar-theme .form-label {
  display: block;
  color: var(--label-color);
  font-weight: var(--label-font-weight);
  margin-bottom: 4px;
}

.calendar-theme .form-input,
.calendar-theme .form-select {
  width: 100%;
  height: var(--input-height);
  padding: var(--input-padding);
  font-size: var(--input-font-size);
  border: var(--input-border);
  border-radius: var(--input-border-radius);
  box-sizing: border-box;
  appearance: none;
  background: var(--input-bg-color);
  color: var(--input-color);
}

.calendar-theme .form-input:focus,
.calendar-theme .form-select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
}

.calendar-theme .submit-button {
  background-color: var(--button-bg-color);
  color: var(--button-color);
  padding: var(--button-padding);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1rem;
}

.calendar-theme .submit-button:hover {
  background-color: var(--button-hover-bg-color);
}

/* Calendar Layout */
.calendar-theme .calendar {
  display: flex;
  flex-direction: column;
}

.calendar-theme .hours-and-days {
  display: flex;
  align-items: stretch;
}

.calendar-theme .hours {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 50px;
  height: 100%;
}

.calendar-theme .hours .hour {
  min-height: 40px;
  border-bottom: 1px solid var(--grid-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-grow: 1;
}

.calendar-theme .weekdays-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.calendar-theme .weekdays {
  list-style-type: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-bottom: 1px solid var(--grid-border-color);
  margin: 0;
  height: 40px;
}

.calendar-theme .weekday {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  margin-bottom: 13px;
}

.calendar-theme .days {
  display: flex;
  flex-grow: 1;
}

.calendar-theme .day {
  flex: 1;
  border-left: 1px solid var(--grid-border-color);
  position: relative;
}

.calendar-theme .day .hour {
  min-height: 40px;
  border-bottom: 1px solid var(--grid-border-color);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  flex-grow: 1;
}

/* Events */
.calendar-theme .event {
  background-color: var(--calendar-primary-color);
  padding: 2px;
  font-size: 12px;
  border-radius: var(--event-border-radius);
  width: 95%;
  box-sizing: border-box;
  position: absolute;
  cursor: grab;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.calendar-theme .event:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.calendar-theme .event:active {
  cursor: grabbing;
}

.calendar-theme .event span {
  color: var(--event-title-color, #000);
  font-size: var(--event-title-size, 16px);
}

.calendar-theme .empty-slot {
  height: 40px;
}

/* Navigation */
.calendar-theme .navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-theme .arrow-button {
  background-color: var(--arrow-button-bg);
  color: var(--arrow-button-color);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin: 0 1rem;
  transition: background-color 0.15s ease;
}

.calendar-theme .arrow-button:hover {
  background-color: var(--button-hover-bg-color);
}

.calendar-theme .current-week {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--current-week-color);
}

/* Info Button */
.calendar-theme .info-button {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: transparent;
  border: none;
  color: var(--accent-color);
  font-weight: bold;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.calendar-theme .info-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* Remove Button */
.calendar-theme .remove-button {
  background-color: var(--danger-bg);
  color: var(--danger-text);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 1rem;
  transition: filter 0.15s ease;
}

.calendar-theme .remove-button:hover {
  filter: brightness(0.9);
}

/* Popup */
.calendar-theme .popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--popup-overlay-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.calendar-theme .popup-content {
  background-color: var(--popup-bg);
  padding: 1rem;
  border-radius: var(--popup-border-radius);
  max-width: 400px;
  width: 100%;
}

.calendar-theme .close-button {
  background-color: var(--button-bg-color);
  color: var(--button-color);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 1rem;
}

/* ============================================================================
   RESPONSIVE
============================================================================ */
@media (max-width: 768px) {
  .calendar-theme .form-container {
    flex-direction: column;
  }

  .calendar-theme .form-group {
    min-width: 100%;
  }

  .calendar-theme .weekday span:first-child {
    font-size: 0.75rem;
  }

  .calendar-theme .event {
    font-size: 10px;
  }

  .calendar-theme .event span {
    font-size: 12px !important;
  }
}
</style>