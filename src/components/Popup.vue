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
      <button class="close-button" @click="closePopup">
        {{ closeButtonText }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from 'vue';
import { PopupProps } from '../types/EventInterfaces';

const props = defineProps<PopupProps & { popupFields: string[] }>();

const emit = defineEmits<{ (e: 'close'): void }>();

// Function for formatting the key for better readability
const formatKey = (key: string): string => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

// Filter event data based on popupFields
const filteredEventData = computed(() => {
  if (!props.eventData) return {};
  return Object.keys(props.eventData)
    .filter(key => props.popupFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = props.eventData[key];
      return obj;
    }, {} as Record<string, any>);
});

const closePopup = (): void => {
  emit('close');
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
