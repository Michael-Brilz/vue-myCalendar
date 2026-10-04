<template>
  <div v-if="visible" class="popup" @click.self="closePopup">
    <div class="popup-content" ref="popupRef" @mousedown="onMouseDown">

      <!-- Header -->
      <div class="popup-header" :style="{ borderLeftColor: editableEventData.color || 'var(--accent-color)' }">
        <div class="popup-header-text">
          <input
            v-if="createMode"
            v-model="editableEventData.title"
            class="popup-title-input"
            placeholder="Titel…"
            autofocus
          />
          <h2 v-else class="popup-title">{{ editableEventData.title }}</h2>
          <span v-if="formattedTime && !createMode" class="popup-header-time">{{ formattedTime }}</span>
        </div>
        <div class="popup-header-actions">
          <button v-if="!readonly && !createMode" class="icon-button danger" @click="deleteEvent" title="Löschen">
            <font-awesome-icon :icon="['fas', 'trash']" />
          </button>
          <button class="icon-button" @click="closePopup" title="Schließen">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
      </div>

      <!-- Meta info rows -->
      <div class="popup-meta" v-if="editableEventData.date || editableEventData.startsAt || editableEventData.location || editableEventData.link || editableEventData.organizer">
        <!-- Date + Time (legacy format) -->
        <div v-if="editableEventData.date != null" class="meta-row meta-row--editable meta-row--datetime">
          <font-awesome-icon :icon="['fas', 'calendar-days']" class="meta-icon" />
          <input v-model="editableEventData.date" type="date" class="meta-input meta-input--date" />
          <input v-model="editableEventData.start" type="time" class="meta-input meta-input--time" />
          <span class="meta-time-sep">–</span>
          <input v-model="editableEventData.end" type="time" class="meta-input meta-input--time" />
        </div>
        <!-- ISO format: show formatted, not editable inline -->
        <div v-else-if="editableEventData.startsAt" class="meta-row">
          <font-awesome-icon :icon="['fas', 'calendar-days']" class="meta-icon" />
          <span>{{ formattedDate }}<span v-if="formattedTime" class="meta-time">, {{ formattedTime }}</span></span>
        </div>
        <div v-if="editableEventData.location" class="meta-row meta-row--editable">
          <font-awesome-icon :icon="['fas', 'location-dot']" class="meta-icon" />
          <input v-model="editableEventData.location" class="meta-input" :placeholder="'Location'" />
        </div>
        <div v-if="editableEventData.link" class="meta-row">
          <font-awesome-icon :icon="['fas', 'link']" class="meta-icon" />
          <a :href="editableEventData.link" target="_blank" rel="noopener noreferrer" class="popup-link">
            {{ editableEventData.link }}
          </a>
        </div>
        <div v-if="editableEventData.organizer" class="meta-row meta-row--editable">
          <font-awesome-icon :icon="['fas', 'user']" class="meta-icon" />
          <input v-model="editableEventData.organizer" class="meta-input" :placeholder="'Organizer'" />
        </div>
      </div>

      <!-- Description / Info -->
      <div v-if="editableEventData.description || editableEventData.info" class="popup-description-wrap">
        <p class="popup-description">{{ editableEventData.description || editableEventData.info }}</p>
      </div>

      <!-- Extra custom fields -->
      <div v-if="Object.keys(extraFields).length" class="popup-section">
        <template v-for="(value, key) in extraFields" :key="key">
          <div class="popup-field">
            <label class="popup-label">{{ formatKey(String(key)) }}</label>
            <input v-model="editableEventData[key]" class="popup-input" :placeholder="formatKey(String(key))" />
          </div>
        </template>
      </div>

      <!-- Participants -->
      <div class="popup-section">
        <div class="section-header">
          <font-awesome-icon :icon="['fas', 'users']" class="section-icon" />
          <span class="section-label">{{ participantsLabel }}</span>
        </div>
        <div v-if="localParticipants.length" class="chips">
          <span v-for="(p, i) in localParticipants" :key="i" class="chip">
            {{ p }}
            <button class="chip-remove" @click="removeParticipant(i)" title="Entfernen">×</button>
          </span>
        </div>
        <div v-if="!readonly" class="input-row">
          <input
            v-model="newParticipant"
            :placeholder="participantPlaceholder || 'Teilnehmer hinzufügen…'"
            class="popup-input"
            @keyup.enter="addParticipant"
          />
          <button class="add-inline-button" @click="addParticipant" title="Hinzufügen">
            <font-awesome-icon :icon="['fas', 'user-plus']" />
          </button>
        </div>
      </div>

      <!-- Todos -->
      <div class="popup-section">
        <div class="section-header">
          <font-awesome-icon :icon="['fas', 'list-check']" class="section-icon" />
          <span class="section-label">{{ todosLabel }}</span>
        </div>
        <ul v-if="localTodos.length" class="todo-list">
          <li v-for="(todo, i) in localTodos" :key="i" class="todo-item">
            <span class="todo-bullet"></span>
            <span class="todo-text">{{ todo }}</span>
            <button class="todo-remove" @click="removeToDos(i)" title="Entfernen">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </li>
        </ul>
        <div v-if="!readonly" class="input-row">
          <input
            v-model="newTodo"
            :placeholder="todoPlaceholder || 'Neue Aufgabe…'"
            class="popup-input"
            @keyup.enter="addTodo"
          />
          <button class="add-inline-button" @click="addTodo" title="Hinzufügen">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div v-if="!readonly || createMode" class="popup-footer">
        <button class="save-button" @click="saveChanges">{{ createMode ? 'Erstellen' : 'Speichern' }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { usePopupLogic } from '@/composables/usePopupLogic';
import type { EventInfo, PopupProps } from '@/types/EventInterfaces';

const props = defineProps<PopupProps & {
  todosLabel?: string;
  participantsLabel?: string;
  visible: boolean;
  eventData: EventInfo;
  todos?: string[];
  participants?: string[];
  todoPlaceholder?: string;
  participantPlaceholder?: string;
  readonly?: boolean;
  createMode?: boolean;
}>();

const readonly = computed(() => props.readonly ?? false);
const createMode = computed(() => props.createMode ?? false);

const todosLabel = computed(() => props.todosLabel || 'To-Do');
const participantsLabel = computed(() => props.participantsLabel || 'Teilnehmer');

const emit = defineEmits<{
  (e: 'submit-event', payload: EventInfo): void;
  (e: 'handle-delete', payload: number): void;
  (e: 'update-event', payload: EventInfo): void;
  (e: 'show-info', payload: EventInfo): void;
  (e: 'close-popup'): void;
  (e: 'update:todos', payload: { todos: string[], eventId: number }): void;
  (e: 'update:participants', payload: { participants: string[], eventId: number }): void;
}>();

const {
  editableEventData,
  filteredEventData,
  formatKey,
  localTodos,
  newTodo,
  addTodo,
  localParticipants,
  newParticipant,
  addParticipant,
} = usePopupLogic(props, emit);

// Fields that are rendered with dedicated UI — excluded from the generic loop
const KNOWN_KEYS = new Set([
  'id', 'title', 'date', 'start', 'end', 'startsAt', 'endsAt',
  'color', 'location', 'link', 'organizer', 'description', 'info',
  'todos', 'participants', 'allDay', 'source', 'editable',
  'reminderMinutes', 'recurrence',
]);

// Custom/extra fields not covered by the dedicated sections
const extraFields = computed(() =>
  Object.fromEntries(
    Object.entries(filteredEventData.value).filter(
      ([key]) => key !== 'title' && !KNOWN_KEYS.has(key)
    )
  )
);

// Formatted date (e.g. "14. August 2026")
const formattedDate = computed(() => {
  const d = editableEventData.value;
  if (d.date) {
    const [y, m, day] = d.date.split('-').map(Number);
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(y, m - 1, day));
  }
  if (d.startsAt) {
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(d.startsAt));
  }
  return '';
});

// Formatted time range (e.g. "09:00 – 17:00")
const formattedTime = computed(() => {
  const d = editableEventData.value;
  if (d.start && d.end) return `${d.start} – ${d.end}`;
  if (d.startsAt && d.endsAt) {
    const fmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
    return `${fmt.format(new Date(d.startsAt))} – ${fmt.format(new Date(d.endsAt))}`;
  }
  return '';
});

const closePopup = () => emit('close-popup');
const deleteEvent = () => emit('handle-delete', props.eventData.id);

const saveChanges = () => {
  const data: EventInfo = {
    ...editableEventData.value,
    todos: localTodos.value,
    participants: localParticipants.value,
  };
  if (createMode.value) {
    emit('submit-event', data);
  } else {
    emit('update-event', data);
    emit('update:todos', { todos: localTodos.value, eventId: props.eventData.id });
    emit('update:participants', { participants: localParticipants.value, eventId: props.eventData.id });
  }
  emit('close-popup');
};

// Drag
const popupRef = ref<HTMLElement | null>(null);
const offset = { x: 0, y: 0 };
const onMouseDown = (e: MouseEvent) => {
  // Don't start drag when clicking interactive elements inside the popup
  const target = e.target as HTMLElement;
  if (target.closest('input, textarea, button, a, select')) return;

  if (!popupRef.value) return;
  const el = popupRef.value;
  offset.x = e.clientX - el.getBoundingClientRect().left;
  offset.y = e.clientY - el.getBoundingClientRect().top;
  const onMouseMove = (ev: MouseEvent) => {
    el.style.left = `${ev.clientX - offset.x}px`;
    el.style.top = `${ev.clientY - offset.y}px`;
    el.style.position = 'absolute';
    el.style.transform = 'none';
  };
  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

const removeToDos = (index: number) => {
  localTodos.value.splice(index, 1);
  emit('update:todos', { todos: [...localTodos.value], eventId: editableEventData.value.id });
};

const removeParticipant = (index: number) => {
  localParticipants.value.splice(index, 1);
  emit('update:participants', { participants: [...localParticipants.value], eventId: editableEventData.value.id });
};
</script>

<style>
/* ── Overlay ───────────────────────────────────────────────────────────────── */
.popup {
  position: fixed;
  inset: 0;
  background: var(--popup-overlay-bg, rgba(0, 0, 0, 0.45));
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Card ──────────────────────────────────────────────────────────────────── */
.popup-content {
  background: var(--popup-bg, #fff);
  color: var(--body-text-color, #222);
  border-radius: var(--popup-border-radius, 12px);
  max-width: 480px;
  width: calc(100% - 2rem);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  user-select: none; /* prevents text selection while dragging the popup */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22), 0 2px 8px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Header ────────────────────────────────────────────────────────────────── */
.popup-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.2rem 1rem;
  border-left: 5px solid var(--accent-color, #007bff);
  background: var(--popup-header-bg, rgba(0, 0, 0, 0.03));
}

.popup-header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.popup-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--popup-title-color, #111);
  line-height: 1.2;
  word-break: break-word;
}

.popup-header-time {
  font-size: 0.8rem;
  opacity: 0.65;
  font-weight: 500;
}

.popup-title-input {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--popup-title-color, #111);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--popup-input-focus-border, var(--accent-color, #007bff));
  outline: none;
  padding: 0 0 2px;
  width: 100%;
  line-height: 1.2;
  user-select: text;
  cursor: text;
}

.popup-header-actions {
  display: flex;
  gap: 0.3rem;
  flex-shrink: 0;
}

/* ── Icon buttons ──────────────────────────────────────────────────────────── */
.icon-button {
  background: none;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 6px;
  color: var(--popup-icon-color, #555);
  transition: background 0.15s, color 0.15s;
  line-height: 1;
}

.icon-button:hover {
  background: rgba(0, 0, 0, 0.07);
  color: var(--popup-icon-hover-color, #111);
}

.icon-button.danger:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

/* ── Meta rows ─────────────────────────────────────────────────────────────── */
.popup-meta {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  padding: 0.85rem 1.2rem;
  border-bottom: 1px solid var(--grid-border-color, #eee);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.875rem;
  color: var(--body-text-color, #333);
  min-height: 1.6rem;
}

.meta-icon {
  width: 14px;
  text-align: center;
  flex-shrink: 0;
  opacity: 0.6;
}

.meta-time {
  opacity: 0.7;
  margin-left: 4px;
}

.meta-row--editable .meta-input {
  flex: 1;
  font-size: 0.875rem;
  border: none;
  border-bottom: 1px solid transparent;
  background: transparent;
  outline: none;
  color: var(--body-text-color, #333);
  padding: 0;
  transition: border-color 0.15s;
  user-select: text;
  cursor: text;
  min-width: 0;
}

.meta-row--editable .meta-input:focus {
  border-bottom-color: var(--popup-input-focus-border, var(--accent-color, #007bff));
}

.meta-row--datetime {
  gap: 6px;
  flex-wrap: wrap;
}

.meta-input--date {
  flex: 1 1 120px;
}

.meta-input--time {
  flex: 0 0 auto;
  width: 80px;
}

.meta-time-sep {
  opacity: 0.5;
  font-size: 0.875rem;
}

.popup-link {
  color: var(--accent-color, #007bff);
  text-decoration: none;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 340px;
  display: inline-block;
  transition: opacity 0.15s;
}

.popup-link:hover {
  opacity: 0.75;
  text-decoration: underline;
}

/* ── Description ───────────────────────────────────────────────────────────── */
.popup-description-wrap {
  padding: 0.75rem 1.2rem;
  border-bottom: 1px solid var(--grid-border-color, #eee);
}

.popup-description {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: var(--body-text-color, #444);
  opacity: 0.85;
}

/* ── Generic extra fields ──────────────────────────────────────────────────── */
.popup-field {
  margin-bottom: 0.7rem;
}

.popup-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--popup-label-color, #777);
  margin-bottom: 0.2rem;
}

.popup-input {
  width: 100%;
  font-size: 0.9rem;
  padding: 0.2rem 0;
  border: none;
  border-bottom: 1px solid var(--grid-border-color, #ccc);
  background: transparent;
  outline: none;
  color: var(--body-text-color, #222);
  box-sizing: border-box;
  transition: border-color 0.15s;
  user-select: text;
  cursor: text;
}

.popup-input:focus {
  border-bottom-color: var(--popup-input-focus-border, var(--accent-color, #007bff));
}

/* ── Sections (participants & todos) ───────────────────────────────────────── */
.popup-section {
  padding: 0.85rem 1.2rem;
  border-bottom: 1px solid var(--grid-border-color, #eee);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.section-icon {
  font-size: 0.8rem;
  opacity: 0.55;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--popup-label-color, #777);
}

/* ── Participant chips ─────────────────────────────────────────────────────── */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--calendar-primary-color, #e8f0fe);
  color: var(--body-text-color, #333);
  font-size: 0.8rem;
  font-weight: 500;
  padding: 3px 8px 3px 10px;
  border-radius: 999px;
  line-height: 1;
}

.chip-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  color: inherit;
  opacity: 0.5;
  transition: opacity 0.15s;
}

.chip-remove:hover {
  opacity: 1;
}

/* ── Todo list ─────────────────────────────────────────────────────────────── */
.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.12s;
}

.todo-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.todo-bullet {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-color, #007bff);
  flex-shrink: 0;
  opacity: 0.6;
}

.todo-text {
  flex: 1;
  font-size: 0.875rem;
}

.todo-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--popup-icon-color, #888);
  padding: 2px;
  border-radius: 4px;
  transition: color 0.15s;
  opacity: 0;
  line-height: 1;
}

.todo-item:hover .todo-remove {
  opacity: 1;
}

.todo-remove:hover {
  color: #dc2626;
}

/* ── Input row ─────────────────────────────────────────────────────────────── */
.input-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.add-inline-button {
  background: var(--popup-inline-btn-bg, #f3f4f6);
  color: var(--popup-inline-btn-color, #555);
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 0.85rem;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}

.add-inline-button:hover {
  background: var(--accent-color, #007bff);
  color: var(--accent-contrast, #fff);
}

/* ── Footer ────────────────────────────────────────────────────────────────── */
.popup-footer {
  padding: 0.9rem 1.2rem;
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background: var(--popup-save-bg, var(--button-bg-color, #007bff));
  color: var(--popup-save-color, var(--button-color, #fff));
  border: none;
  padding: 0.55rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: var(--button-border-radius, 8px);
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  letter-spacing: 0.02em;
}

.save-button:hover {
  background: var(--popup-save-hover-bg, var(--button-hover-bg-color, #0056b3));
}

.save-button:active {
  transform: scale(0.97);
}
</style>
