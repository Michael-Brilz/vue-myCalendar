<!-- Popup.vue -->
<template>
    <div v-if="visible" class="popup">
      <div class="popup-content">
        <!-- Slot for dynamic content -->
        <slot></slot>
        <button class="close-button" @click="closePopup">
          {{ closeButtonText }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    closeButtonText: {
      type: String,
      default: 'Close'
    }
  });
  
  const emit = defineEmits(['close']);
  
  const closePopup = () => {
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
  