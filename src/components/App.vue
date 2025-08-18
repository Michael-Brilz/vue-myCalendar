<template>
  <div class="wrapper">
    <!-- Theme Switcher (nur Light/Dark) -->
    <div class="toolbar">
      <button
          type="button"
          class="toggle-btn"
          :class="{ active: !isDark }"
          @click="setLight"
          aria-pressed="!isDark"
      >
        Light
      </button>
      <button
          type="button"
          class="toggle-btn"
          :class="{ active: isDark }"
          @click="setDark"
          aria-pressed="isDark"
      >
        Dark
      </button>
    </div>

    <ScheduleForm
        :schedules="schedules"
        :additional-fields="additionalFields"
        :custom-class="scheduleFormClass"
        :labels-and-settings="labelsAndSettings"
        :popup-fields="popupFields"
        :popup-visible="isPopupVisible"
        :popup-event="selectedEvent"
        @update:todos="handleUpdatedTodos"
        @update:participants="handleUpdatedParticipants"
        @handle-delete="handleDeleteEvent"
        @update-event="handleUpdateEvent"
        @show-info="handleShowInfo"
        @close-popup="isPopupVisible = false"
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
    date: '2025-07-04',
    start: '09:00',
    end: '10:00',
    teacher: 'Malika Heaney',
    room: 'Room 1',
    color: '#e2Be33',
    todos: ['Prepare', 'Print documents'],
    participants: ['Malika', 'Jonas']
  },
  {
    id: 2,
    title: 'Workshop',
    date: '2025-07-04',
    start: '13:00',
    end: '15:00',
    teacher: 'John Doe',
    room: 'Room 2',
    color: '#33C3FF',
    todos: ['Set up the projector'],
    participants: ['John', 'Lena']
  },
]);

const popupFields = ref(['title', 'date', 'start', 'end']);
const isPopupVisible = ref(false);
const selectedEvent = ref<EventInfo | null>(null);

const additionalFields = ref([
  { id: 'teacher', label: 'Teacher', type: 'text', model: 'teacher' },
  {
    id: 'room',
    label: 'Room',
    type: 'select',
    model: 'room',
    options: [{ id: 1, name: 'Room 1' }, { id: 2, name: 'Room 2' }]
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

/* Custom-Variablen fürs Kind */
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

  --button-padding: 12px 20px;
  --button-border-radius: 8px;
}

.customize-schedule-form.dark {
  --label-color: #ffffff;
  --form-border: 1px solid rgba(255,255,255,0.15);
  --input-border: 1px solid rgba(255,255,255,0.2);
}
</style>
