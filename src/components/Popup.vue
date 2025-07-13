<template>
  <div v-if="visible" class="popup">
    <div class="popup-content" ref="popupRef" @mousedown="onMouseDown">
      <!-- Top icon bar -->
      <div class="top-right-icons">
        <button class="icon-button" @click="deleteEvent" title="Delete">
          <font-awesome-icon :icon="['fas', 'trash']" />
        </button>
        <button class="icon-button" @click="closePopup" title="Close">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>

      <!-- Title -->
      <h2 class="popup-title">{{ editableEventData.title }}</h2>

      <div v-if="eventData && Object.keys(eventData).length">
        <template v-for="(value, key) in filteredEventData" :key="key">
          <div v-if="key !== 'title'" class="popup-field">
            <label class="popup-label">{{ formatKey(String(key)) }}</label>
            <input v-model="editableEventData[key]" class="popup-input" :placeholder="formatKey(String(key))" />
          </div>
        </template>
      </div>

      <!-- To-dos -->
      <div class="section">
        <label class="popup-label">{{ todosLabel }}</label>
        <ul class="list">
          <li v-for="(todo, i) in localTodos" :key="i">
            {{ todo }}
            <button @click="removeToDos(i)">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </li>
        </ul>
        <div class="input-row">
          <input v-model="newTodo" placeholder="New To-do..." class="popup-input" />
          <button class="add-inline-button" @click="addTodo">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </button>
        </div>
      </div>

      <!-- Participants -->
      <div class="section">
        <label class="popup-label">{{ participantsLabel }}</label>
        <ul class="list">
          <li v-for="(p, i) in localParticipants" :key="i">
            {{ p }}
            <button @click="removeParticipant(i)">
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </li>
        </ul>
        <div class="input-row">
          <input v-model="newParticipant" placeholder="Add Participant ..." class="popup-input" />
          <button class="add-inline-button" @click="addParticipant">
            <font-awesome-icon :icon="['fas', 'user-plus']" />
          </button>
        </div>
      </div>
      <!-- Save -->
      <div class="popup-footer">
        <button class="save-button" @click="saveChanges">Speichern</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { usePopupLogic } from '../composables/usePopupLogic';
import type { EventInfo, PopupProps } from '../types/EventInterfaces';

const props = defineProps<PopupProps & {
  todosLabel?: string;
  participantsLabel?: string;
  visible: boolean;
  eventData: EventInfo;
  todos?: string[];
  participants?: string[];
  todoPlaceholder?: string;
  participantPlaceholder?: string;
}>();

const todosLabel = computed(() => props.todosLabel || 'To-do');
const participantsLabel = computed(() => props.participantsLabel || 'Participant');

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

const closePopup = () => emit('close-popup');
const deleteEvent = () => emit('handle-delete', props.eventData.id);

const saveChanges = () => {
  const updated: EventInfo = {
    ...editableEventData.value,
    todos: localTodos.value,
    participants: localParticipants.value,
  };

  emit('update-event', updated);
  emit('update:todos', { todos: localTodos.value, eventId: props.eventData.id });
  emit('update:participants', { participants: localParticipants.value, eventId: props.eventData.id });
  emit('close-popup');
};

// Drag
const popupRef = ref<HTMLElement | null>(null);
const offset = { x: 0, y: 0 };
const onMouseDown = (e: MouseEvent) => {
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
  emit('update:todos', {
    todos: [...localTodos.value],
    eventId: editableEventData.value.id,
  });
};

const removeParticipant = (index: number) => {
  localParticipants.value.splice(index, 1);
  emit('update:participants', {
    participants: [...localParticipants.value],
    eventId: editableEventData.value.id,
  });
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.popup-content {
  background: #fff;
  padding: 1rem;
  border-radius: 6px;
  max-width: 450px;
  width: 100%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
}

.top-right-icons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.icon-button:hover {
  color: #646262;
}

.icon-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem;
  color: #444;
}

.popup-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0.5rem 0 1rem;
  color: #222;
}

.popup-field {
  margin-bottom: 0.8rem;
}

.popup-label {
  margin-bottom: 0.2rem;
  font-weight: 600;
  color: #333;
}

.popup-input {
  width: 100%;
  font-size: 1rem;
  padding: 0.2rem 0;
  border: none;
  border-bottom: 1px solid #ccc;
  background: transparent;
  outline: none;
}

.popup-input:focus {
  border-bottom-color: #007bff;
}

.section {
  margin-top: 1.5rem;
}

.list {
  list-style: none;
  padding: 0;
  margin-bottom: 0.5rem;
}

.list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}

.input-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.add-inline-button {
  background: #ffffff;
  color: #444;
  width: 2.2rem;
  height: 2.2rem;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: 0.2s;
  font-size: 1rem;
}

.add-inline-button:hover {
  color: #646262;
}

.popup-footer {
  margin-top: 1.5rem;
  text-align: center;
}

.save-button {
  background: #444;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
}

.save-button:hover {
  background: #646262;
}
</style>
