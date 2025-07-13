import { ref, computed, watch } from 'vue';
import { PopupProps } from '../types/EventInterfaces';

export function usePopupLogic(
  props: PopupProps & {
    popupFields?: string[];
  },
  emit: any
) {
  const popupFields = computed(() => props.popupFields || []);

  const editableEventData = ref({ ...props.eventData });

  const localTodos = ref<string[]>([...(props.eventData?.todos || [])]);
  const localParticipants = ref<string[]>([...(props.eventData?.participants || [])]);

  watch(() => props.eventData, (newVal) => {
  if (!newVal) return;
  editableEventData.value = { ...newVal };
  localTodos.value = [...(newVal.todos || [])];
  localParticipants.value = [...(newVal.participants || [])];
  }, { immediate: true });

  const formatKey = (key: string): string => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredEventData = computed(() => {
    if (popupFields.value.length === 0) return editableEventData.value;
    return Object.fromEntries(
      Object.entries(editableEventData.value).filter(([key]) => popupFields.value!.includes(key))
    );
  });

  const updateField = (key: string, value: any) => {
    editableEventData.value[key] = value;
    emit('updateEvent', editableEventData.value);
  };

  const newTodo = ref('');
  const addTodo = () => {
    const todo = newTodo.value.trim();
    if (!todo) return;
    localTodos.value.push(todo);
    newTodo.value = '';
    emit('update:todos', { todos: [...localTodos.value], eventId: editableEventData.value.id });
  };

  const removeTodo = (index: number) => {
    localTodos.value.splice(index, 1);
    emit('update:todos', { todos: [...localTodos.value], eventId: editableEventData.value.id });
  };

  const newParticipant = ref('');
  const addParticipant = () => {
    const participant = newParticipant.value.trim();
    if (!participant) return;
    localParticipants.value.push(participant);
    newParticipant.value = '';
    emit('update:participants', { participants: [...localParticipants.value], eventId: editableEventData.value.id });
  };

  const removeParticipant = (index: number) => {
    localParticipants.value.splice(index, 1);
    emit('update:participants', { participants: [...localParticipants.value], eventId: editableEventData.value.id });
  };

  return {
    editableEventData,
    popupFields,
    filteredEventData,
    formatKey,
    updateField,

    // Todos
    localTodos,
    newTodo,
    addTodo,
    removeTodo,

    // Participants
    localParticipants,
    newParticipant,
    addParticipant,
    removeParticipant,
  };
}
