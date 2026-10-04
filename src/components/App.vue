<template>
  <div class="wrapper">
    <!-- Theme Switcher (nur Light/Dark) -->
    <div class="toolbar">
      <button
          type="button"
          class="toggle-btn"
          :class="{ active: !isDark }"
          @click="setLight"
          :aria-pressed="!isDark"
      >
        Light
      </button>
      <button
          type="button"
          class="toggle-btn"
          :class="{ active: isDark }"
          @click="setDark"
          :aria-pressed="isDark"
      >
        Dark
      </button>
    </div>

    <ScheduleForm
        :schedules="schedules"
        :additional-fields="additionalFields"
        :custom-class="scheduleFormClass"
        time-zone="Europe/Berlin"
        :week-starts-on="1"
        :labels-and-settings="labelsAndSettings"
        :popup-fields="popupFields"
        :popup-visible="isPopupVisible"
        :popup-event="selectedEvent"
        @update:todos="handleUpdatedTodos"
        @update:participants="handleUpdatedParticipants"
        @handle-delete="handleDeleteEvent"
        @update-event="handleUpdateEvent"
        @submit-event="handleSubmitEvent"
        @show-info="handleShowInfo"
        @close-popup="isPopupVisible = false"
        @slot-click="handleSlotClick"
        @range-change="handleRangeChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ScheduleForm from './ScheduleForm.vue';
import type { EventInfo } from '@/types/EventInterfaces';

const isDark = ref(false);

function syncRoot() {
  const root = document.documentElement;
  root.classList.toggle('dark', isDark.value);
}

function setLight() { isDark.value = false; syncRoot(); }
function setDark()  { isDark.value = true;  syncRoot(); }

onMounted(syncRoot);

const scheduleFormClass = computed(() =>
    isDark.value ? 'customize-schedule-form dark' : 'customize-schedule-form'
);

const schedules = ref<EventInfo[]>([
  {
    id: 1,
    title: 'Meeting',
    date: '2026-08-14',
    start: '09:00',
    end: '20:00',
    organizer: 'Malika Heaney',
    location: 'Konferenzraum A',
    color: '#e2Be33',
    description: 'Quarterly planning session – bring Q3 results.',
    todos: ['Prepare slides', 'Print documents'],
    participants: ['Malika', 'Jonas', 'Sara'],
  },
  {
    id: 2,
    title: 'Workshop',
    date: '2026-08-14',
    start: '13:00',
    end: '18:00',
    organizer: 'John Doe',
    location: 'Konferenzraum B',
    link: 'https://meet.google.com/abc-defg-hij',
    color: '#33C3FF',
    todos: ['Set up the projector', 'Prepare handouts'],
    participants: ['John', 'Lena'],
  },
  {
    id: 3,
    title: 'Daily Standup',
    date: '2026-08-14',
    start: '08:00',
    end: '08:30',
    organizer: 'John Doe',
    link: 'https://zoom.us/j/123456789',
    color: '#df3cae',
    todos: [],
    participants: ['John', 'Lena', 'Tim', 'Anna'],
  },
  {
    id: 4,
    title: 'Team Off-site',
    date: '2026-08-14',
    start: '00:00',
    end: '23:59',
    allDay: true,
    color: '#7c3aed',
    description: 'Ganztägiges Teamevent außerhalb des Büros.',
    participants: ['Alle'],
  },
]);

const popupFields = ref<string[]>([]);
const isPopupVisible = ref(false);
const selectedEvent = ref<EventInfo | null>(null);

const additionalFields = ref([
  { id: 'organizer', label: 'Organizer', type: 'text', model: 'organizer' },
  {
    id: 'location',
    label: 'Location',
    type: 'select',
    model: 'location',
    options: [{ id: 1, name: 'Konferenzraum A' }, { id: 2, name: 'Konferenzraum B' }, { id: 3, name: 'Online' }]
  },
]);

const labelsAndSettings = computed(() => ({
  startTimeLabel: 'Start Time',
  endTimeLabel: 'End Time',
  dateLabel: 'Date',
  submitButtonText: 'Add Event',
  calendarWeekLabel: 'Week',
}));

/** Event-Handler */
const handleSubmitEvent = (event: EventInfo) => {
  const newId = Math.max(0, ...schedules.value.map(e => e.id)) + 1;
  schedules.value.push({ ...event, id: newId });
};

const handleDeleteEvent = (eventId: number) => {
  schedules.value = schedules.value.filter(event => event.id !== eventId);
};

const handleUpdateEvent = (event: EventInfo) => {
  const index = schedules.value.findIndex(e => e.id === event.id);
  if (index !== -1) schedules.value[index] = event;
};

const handleShowInfo = (event: EventInfo) => {
  selectedEvent.value = event;
  isPopupVisible.value = true;
};

const handleUpdatedTodos = ({ todos, eventId }: { todos: string[], eventId: number }) => {
  const event = schedules.value.find(e => e.id === eventId);
  if (event) event.todos = todos;
};

const handleUpdatedParticipants = ({ participants, eventId }: { participants: string[], eventId: number }) => {
  const event = schedules.value.find(e => e.id === eventId);
  if (event) event.participants = participants;
};

const handleSlotClick = ({ date, start, end }: { date: string; start?: string; end?: string }) => {
  console.log('Slot clicked:', date, start, end);
};

const handleRangeChange = ({ start, end, view }: { start: string; end: string; view: string }) => {
  console.log('Visible range:', start, '–', end, `(${view})`);
};
</script>

<style scoped lang="scss">
.wrapper {
  padding: 20px;
}

.toolbar {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.toggle-btn {
  background: #e5e7eb;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background .2s ease, transform .02s ease, border-color .2s ease;
}
.toggle-btn:hover { background: #dbe1e6; }
.toggle-btn:active { transform: translateY(1px); }
.toggle-btn.active { border-color: #111827; }

/* Custom-Variablen fürs Kind — strukturell (beide Modi) */
.customize-schedule-form {
  --font-family: 'Inter', system-ui, sans-serif;
  --event-border-radius: 6px;
  --form-padding: 20px;
  --form-border-radius: 10px;
  --label-font-weight: 500;
  --input-border-radius: 5px;
  --input-padding: 10px;
  --input-font-size: 15px;
  --button-padding: 12px 20px;
  --button-border-radius: 8px;
}

/* Light-Mode-Farben (nur wenn NICHT dark) */
.customize-schedule-form:not(.dark) {
  --accent-color: #E30613;
  --accent-contrast: #ffffff;

  --grid-border-color: #e0e0e0;
  --calendar-primary-color: #f3c6c9;
  --event-title-color: #1a1a1a;

  --button-bg-color: #E30613;
  --button-hover-bg-color: #b3050f;
  --button-color: #ffffff;

  --arrow-button-bg: #E30613;
  --arrow-button-color: #ffffff;

  --month-today-bg: color-mix(in srgb, #E30613 12%, transparent);
  --month-chip-color: #1a1a1a;

  --form-border: 1px solid #333;
  --label-color: #445269;
  --input-border: 1px solid #445269;
}

/* Dark-Mode-Overrides */
.customize-schedule-form.dark {
  --label-color: #e8e8e8;
  --form-border: 1px solid rgba(255, 255, 255, 0.12);
  --input-border: 1px solid rgba(255, 255, 255, 0.18);
  --input-bg-color: #2a2a2a;
  --form-bg-color: #1e1e1e;
}

/* Toolbar-Buttons im Dark-Mode */
:root.dark .toggle-btn {
  background: #2a2a2a;
  color: #e0e0e0;
  border-color: rgba(255, 255, 255, 0.15);
}
:root.dark .toggle-btn:hover { background: #3a3a3a; }
:root.dark .toggle-btn.active {
  border-color: #D2F7D8;
  color: #D2F7D8;
}
</style>

<!-- Popup variables live on the calendar-theme root (CSS custom properties cascade
     through the DOM regardless of position: fixed). These :root rules are a fallback. -->
<style>
:root {
  --popup-bg: #ffffff;
  --popup-title-color: #E30613;
  --popup-label-color: #555555;
  --popup-input-focus-border: #E30613;
  --popup-save-bg: #E30613;
  --popup-save-hover-bg: #b3050f;
}

:root.dark {
  --popup-bg: #1e1e1e;
  --popup-title-color: #ffffff;
  --popup-label-color: #aaaaaa;
  --popup-input-focus-border: #D2F7D8;
  --popup-save-bg: #D2F7D8;
  --popup-save-hover-bg: #b2e7c0;
  --popup-save-color: #121212;
}
</style>