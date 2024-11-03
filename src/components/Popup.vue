<!-- Popup.vue -->
<template>
  <div v-if="visible" class="popup">
    <div class="popup-content">
      <!-- Dynamic display of event data -->
      <div v-if="eventData && Object.keys(eventData).length">
        <div v-for="(value, key) in eventData" :key="key" class="popup-field">
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
import { defineProps, defineEmits } from 'vue';
import { PopupProps } from '../types/EventInterfaces';

const props = defineProps<PopupProps>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// Function for formatting the key for better readability
const formatKey = (key: string): string => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

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
