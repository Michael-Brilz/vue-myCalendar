import { ref, computed, reactive, watch } from 'vue';
import { PopupProps } from '../types/EventInterfaces';

export function usePopupLogic(props: PopupProps & {
  popupFields?: string[];
  todos?: string[];
  participants?: string[];
}, emit: any) {
  const popupFields = computed(() => props.popupFields || []);
  const eventData = computed(() => props.eventData || {});
  const editableEventData = reactive({ ...eventData.value });

  watch(eventData, (newData) => {
    Object.assign(editableEventData, newData);
  });

  // Todos
  const localTodos = ref<string[]>([...(props.todos ?? [])]);
  const newTodo = ref('');
  const addTodo = () => {
    const trimmed = newTodo.value.trim();
    if (trimmed) {
      localTodos.value.push(trimmed);
      newTodo.value = '';
    }
  };
  watch(localTodos, (val) => emit('update:todos', val));

  // Participants
  const localParticipants = ref<string[]>([...(props.participants ?? [])]);
  const newParticipant = ref('');
  const addParticipant = () => {
    const trimmed = newParticipant.value.trim();
    if (trimmed) {
      localParticipants.value.push(trimmed);
      newParticipant.value = '';
    }
  };
  watch(localParticipants, (val) => emit('update:participants', val));

  const formatKey = (key: string): string => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredEventData = computed(() => {
    if (popupFields.value.length === 0) return editableEventData;
    return Object.fromEntries(
      Object.entries(editableEventData).filter(([key]) => popupFields.value.includes(key))
    );
  });

  return {
    popupFields,
    eventData,
    editableEventData,
    localTodos,
    newTodo,
    addTodo,
    localParticipants,
    newParticipant,
    addParticipant,
    filteredEventData,
    formatKey,
  };
}
