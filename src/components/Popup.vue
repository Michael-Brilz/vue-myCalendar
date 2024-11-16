<template>
  <div v-if="visible" class="popup">
    <div class="popup-content">
      <!-- Dynamic display of filtered event data -->
      <div v-if="eventData && Object.keys(eventData).length">
        <div v-for="(value, key) in filteredEventData" :key="key" class="popup-field">
          <p><strong>{{ formatKey(key) }}:</strong> {{ value }}</p>
        </div>
      </div>
      <slot v-else></slot>
      <div class="button-container">
        <button class="close-button" @click="closePopup">
          {{ closeButtonText }}
        </button>
        <button class="delete-button" @click="deleteEvent">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from 'vue';
import { PopupProps } from '../types/EventInterfaces';

const props = defineProps<PopupProps & { popupFields?: string[] }>();

const emit = defineEmits<{ (e: 'close'): void; (e: 'deleteEvent', id: number): void }>();

const popupFields = computed(() => props.popupFields || []);
const eventData = computed(() => props.eventData || {});

const formatKey = (key: string): string => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const filteredEventData = computed(() => {
  if (popupFields.value.length === 0) {
    return eventData.value;
  }
  return Object.keys(eventData.value)
    .filter(key => popupFields.value.includes(key))
    .reduce((obj, key) => {
      obj[key] = eventData.value[key];
      return obj;
    }, {} as Record<string, any>);
});

const closePopup = (): void => {
  emit('close');
};

const deleteEvent = () => {
  emit('deleteEvent', eventData.value.id);
};

</script>

<style scoped>
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

.popup-field {
  margin-bottom: 0.5rem;
}

.button-container {
  margin-top: 1rem;
  text-align: center;
}

.close-button,
.delete-button {
  width: 120px; 
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.6rem;
  margin: 0.5rem 15px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.close-button:hover,
.delete-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.delete-button {
  background-color: #e53e3e;
}

.delete-button:hover {
  background-color: #cc2e2e;
}
</style>
