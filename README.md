# vue3-mycalendar

A powerful and customizable calendar component for Vue 3 with week & month views,
pointer-based drag & drop, time-zone-correct rendering, custom forms, popups, and
full theming via CSS variables.

[![npm version](https://img.shields.io/npm/v/vue3-mycalendar.svg)](https://www.npmjs.com/package/vue3-mycalendar)
[![license](https://img.shields.io/npm/l/vue3-mycalendar.svg)](./LICENSE)

## Features

- Week view with an hour grid **and** a month view (toggle or `v-model:view`)
- **Current time indicator** — live red line in the week view
- **"Today" button** — jump back to the current week/month instantly
- **Click-to-create** — click any empty time slot to pre-fill date & time in the form
- **All-day events** — shown in a dedicated banner row above the hour grid
- Time-zone-correct rendering: events stored in UTC, displayed in a target zone
- Smooth pointer-based drag & drop with a live preview and a time tooltip
- Overlapping events render side by side instead of stacking
- **Rich event cards** in the week view: title, time range, location badge, link indicator, participant count
- **Modern event detail popup:** colored header, date/time, location, clickable online links, participants as chips, todos as a styled list
- **`readonly` prop** — display-only mode (no form, no drag, no edit/delete)
- **`event` scoped slot** — fully custom event block markup
- **`@range-change` event** — emits the visible date range on every navigation, ideal for lazy-loading
- **`@slot-click` event** — emits when an empty time slot is clicked
- Mobile-friendly: week view scrolls horizontally on small screens
- Customizable event forms via scoped slots
- Full theming through CSS variables (light & dark mode)
- TypeScript support
- SSR-compatible (Nuxt / Vite SSR)

## Installation

```bash
npm install vue3-mycalendar
```

## Quick Start

```vue
<template>
  <ScheduleForm
    :schedules="schedules"
    :additional-fields="additionalFields"
    custom-class="my-calendar"
    time-zone="Europe/Berlin"
    :week-starts-on="1"
    v-model:view="view"
    :labels-and-settings="labelsAndSettings"
    :popup-fields="popupFields"
    @submit-event="handleNewEvent"
    @handle-delete="handleDeleteEvent"
    @update-event="handleUpdateEvent"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ScheduleForm } from 'vue3-mycalendar';
import 'vue3-mycalendar/dist/style.css';

const view = ref<'week' | 'month'>('week');

// Preferred: absolute UTC timestamps (startsAt / endsAt).
const schedules = ref([
  {
    id: 1,
    title: 'Meeting',
    startsAt: '2026-06-28T07:00:00Z',
    endsAt: '2026-06-28T08:00:00Z',
    color: '#e2be33',
    room: 'Room 1',
    todos: ['Prepare agenda', 'Print documents'],
    participants: ['Malika', 'Jonas'],
  },
]);

const additionalFields = ref([
  { id: 'title', label: 'Title', type: 'text', model: 'title' },
  {
    id: 'room',
    label: 'Room',
    type: 'select',
    model: 'room',
    options: [
      { id: 1, name: 'Room 1' },
      { id: 2, name: 'Room 2' },
    ],
  },
]);

const popupFields = ref(['title', 'startsAt', 'endsAt', 'room']);

const labelsAndSettings = computed(() => ({
  startTimeLabel: 'Start Time',
  endTimeLabel: 'End Time',
  dateLabel: 'Date',
  submitButtonText: 'Add Event',
  calendarWeekLabel: 'Week',
  weekViewLabel: 'Week',
  monthViewLabel: 'Month',
  todosLabel: 'To-Do',
  participantsLabel: 'Participants',
}));

const handleNewEvent = (event) => {
  const newId = Math.max(...schedules.value.map((e) => e.id), 0) + 1;
  schedules.value.push({ ...event, id: newId });
};

const handleDeleteEvent = (id) => {
  schedules.value = schedules.value.filter((event) => event.id !== id);
};

// Replace by id — do NOT append, or you create a duplicate.
const handleUpdateEvent = (updatedEvent) => {
  const index = schedules.value.findIndex((e) => e.id === updatedEvent.id);
  if (index !== -1) {
    schedules.value[index] = updatedEvent;
  }
};
</script>
```

---

## Time zones

The calendar follows the **store-UTC, render-local** model.

- **Input:** provide events as absolute UTC timestamps via `startsAt` / `endsAt`
  (ISO-8601 with `Z`). The `timeZone` prop controls the zone the grid renders in.
- **Output:** drag & drop and form submit emit events whose `startsAt` / `endsAt`
  are UTC. Legacy `date` / `start` / `end` fields are also filled in (in
  `timeZone`) for backward compatibility.

```vue
<ScheduleForm :schedules="schedules" time-zone="Europe/Berlin" />
```

If `timeZone` is omitted, the browser's zone is used. For multi-user apps where
everyone must see the same wall-clock time regardless of their machine, pass the
zone explicitly.

**Legacy fields still work.** If you provide `date` + `start` + `end` instead of
`startsAt` / `endsAt`, they are interpreted as wall-clock time **in `timeZone`**
and normalized to UTC internally. Prefer `startsAt` / `endsAt` for new code.

---

## Views

The calendar has a **week** view (hour grid) and a **month** view (day cells).

Switch via the built-in toggle buttons, or control it from the outside:

```vue
<!-- Uncontrolled: built-in buttons handle it -->
<ScheduleForm :schedules="schedules" :additional-fields="fields" />

<!-- Controlled -->
<ScheduleForm v-model:view="view" :schedules="schedules" :additional-fields="fields" />
```

- Week view: events are positioned by time; overlapping events split into columns.
- Month view: events appear as compact chips; up to three are shown per day, the
  rest collapse into a "+N" indicator. Clicking a day number or "+N" opens the
  week view of that day.

Set the first day of the week with `week-starts-on` (`0` = Sunday, `1` = Monday,
default `1`).

---

## Drag & drop

Dragging is pointer-based. While dragging you get a live preview of the event at
the snapped position and a floating tooltip showing the target time (week) or
date (month). The event stays under the cursor where you grabbed it.

On drop, an `update-event` event is emitted. **The host must persist it** by
replacing the event in `schedules` (by `id`). The component does not keep a
separate internal copy.

---

## Custom Form Slot

Replace the default form with your own design using the `form` slot. You get full
access to the internal state and methods via scoped slot props.

### Slot Props

| Prop               | Type                                   | Description                               |
| ------------------ | -------------------------------------- | ----------------------------------------- |
| `newEvent`         | `Ref<Partial<EventInfo>>`              | Reactive event object for v-model binding |
| `addEvent`         | `(event?: Partial<EventInfo>) => void` | Submit function to add the event          |
| `additionalFields` | `Field[]`                              | Configured additional fields array        |
| `labels`           | `LabelsAndSettings`                    | All label texts and settings              |
| `resetForm`        | `() => void`                           | Reset form to initial state               |

```vue
<ScheduleForm :schedules="schedules" :additional-fields="[]" @submit-event="handleNewEvent">
  <template #form="{ newEvent, addEvent, labels, resetForm }">
    <div class="custom-form">
      <input v-model="newEvent.title" placeholder="Event title..." />
      <input v-model="newEvent.date" type="date" />
      <input v-model="newEvent.start" type="time" />
      <input v-model="newEvent.end" type="time" />
      <button type="button" @click="resetForm">Reset</button>
      <button type="button" @click="addEvent()">{{ labels.submitButtonText }}</button>
    </div>
  </template>
</ScheduleForm>
```

To remove the form completely, pass an empty `form` slot:

```vue
<ScheduleForm :schedules="schedules" :additional-fields="[]">
  <template #form></template>
</ScheduleForm>
```

---

## Custom Popup Slot

Customize the event details popup with the `popup-calendar` slot.

```vue
<ScheduleForm
  :schedules="schedules"
  :additional-fields="additionalFields"
  :popup-visible="isPopupVisible"
  :popup-event="selectedEvent"
  @show-info="openPopup"
  @close-popup="closePopup"
>
  <template #popup-calendar>
    <div v-if="isPopupVisible && selectedEvent" class="my-popup-overlay">
      <div class="my-popup">
        <h2>{{ selectedEvent.title }}</h2>
        <button @click="closePopup">Close</button>
      </div>
    </div>
  </template>
</ScheduleForm>
```

---

## Props

### Required

| Prop               | Type          | Description                                |
| ------------------ | ------------- | ------------------------------------------ |
| `schedules`        | `EventInfo[]` | Array of events to display on the calendar |
| `additionalFields` | `Field[]`     | Additional fields for the event form       |

### Optional

| Prop                  | Type                  | Default            | Description                                            |
| --------------------- | --------------------- | ------------------ | ----------------------------------------------------- |
| `timeZone`            | `string`              | browser zone       | IANA zone the calendar renders in                     |
| `weekStartsOn`        | `0 \| 1`              | `1` (Monday)       | First day of the week (`0` = Sunday)                  |
| `view`                | `'week' \| 'month'`   | `'week'`           | Active view. Supports `v-model:view`                  |
| `customClass`         | `string`              | `''`               | Custom CSS class for theming                          |
| `customStyles`        | `Record<string, any>` | `{}`               | Inline styles for the root element                    |
| `weekdays`            | `string[]`            | `['Monday', ...]`  | Custom weekday names                                  |
| `eventTitleColor`     | `string`              | `'#000'`           | Event title text color                               |
| `eventTitleSize`      | `string`              | `'16px'`           | Event title font size                                |
| `popupFields`         | `string[]`            | `[]`               | Fields to show in the default popup                  |
| `labelsAndSettings`   | `LabelsAndSettings`   | see below          | Labels and text customization                        |
| `placeholderSettings` | `object`              | `{}`               | Placeholder texts for popup inputs                   |
| `popupVisible`        | `boolean`             | `false`            | Control popup visibility externally                  |
| `popupEvent`          | `EventInfo \| null`   | `null`             | Current event for the popup                          |
| `readonly`            | `boolean`             | `false`            | Disables form, drag & drop, edit and delete          |

### Labels and Settings

```ts
interface LabelsAndSettings {
  startTimeLabel?: string;    // 'Start Time'
  endTimeLabel?: string;      // 'End Time'
  dateLabel?: string;         // 'Date'
  submitButtonText?: string;  // 'Add Entry'
  calendarWeekLabel?: string; // 'CW'
  todosLabel?: string;        // 'To-Do'
  participantsLabel?: string; // 'Teammates'
  weekViewLabel?: string;     // 'Week'
  monthViewLabel?: string;    // 'Month'
}
```

---

## Events

| Event                 | Payload                                       | Description                          |
| --------------------- | --------------------------------------------- | ------------------------------------ |
| `submit-event`        | `EventInfo`                                               | New event submitted via form         |
| `update-event`        | `EventInfo`                                               | Event updated (drag & drop or edit)  |
| `handle-delete`       | `number`                                                  | Event ID to delete                   |
| `show-info`           | `EventInfo`                                               | Event details requested              |
| `close-popup`         | –                                                         | Popup closed                         |
| `update:view`         | `'week' \| 'month'`                                       | Active view changed (`v-model:view`) |
| `update:todos`        | `{ todos: string[], eventId: number }`                    | Todos changed                        |
| `update:participants` | `{ participants: string[], eventId: number }`             | Participants changed                 |
| `slot-click`          | `{ date: string; start?: string; end?: string }`          | Empty slot clicked (click-to-create) |
| `range-change`        | `{ start: string; end: string; view: 'week' \| 'month' }` | Visible date range changed           |

---

## Slots

| Slot             | Scoped Props                                                  | Description                            |
| ---------------- | ------------------------------------------------------------- | -------------------------------------- |
| `form`           | `{ newEvent, addEvent, additionalFields, labels, resetForm }` | Custom event form                      |
| `popup-calendar` | –                                                             | Custom popup for event details         |
| `event`          | `{ event: EventInfo, timeRange: string }`                     | Custom markup inside each event block  |

---

## Type Definitions

### EventInfo

```ts
interface EventInfo {
  id: number;
  title: string;

  // Preferred: absolute UTC timestamps (ISO-8601 with Z).
  startsAt?: string; // e.g. '2026-06-28T07:00:00Z'
  endsAt?: string;

  // Legacy: interpreted as wall-clock time in `timeZone`.
  date?: string;  // 'YYYY-MM-DD'
  start?: string; // 'HH:MM'
  end?: string;   // 'HH:MM'

  color?: string;
  description?: string; // shown as a text block in the popup
  info?: string;        // alias for description
  location?: string;    // displayed in the event card and popup (with location icon)
  link?: string;        // rendered as a clickable anchor in the popup
  organizer?: string;   // shown in the popup with a person icon
  todos?: string[];
  participants?: string[];
  [key: string]: any;   // any additional custom fields
}
```

> Each event needs a **unique `id`**. Duplicate ids cause events to share layout
> and styling.

#### Popup display

The built-in popup auto-detects these fields and renders them with dedicated UI:

| Field         | Display                                              |
| ------------- | ---------------------------------------------------- |
| `title`       | Hero heading with a colored left border              |
| `date`/`startsAt` | Date and time row with calendar icon            |
| `location`    | Editable location field with pin icon                |
| `link`        | Clickable anchor (opens new tab)                     |
| `organizer`   | Editable person field with user icon                 |
| `description` | Text block below the meta section                    |
| `participants` | Removable chips + add-input                         |
| `todos`       | Bullet list with per-item delete + add-input         |

Any other fields in `popupFields` are rendered as generic labeled inputs.

### Field

```ts
interface Field {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'time' | 'number';
  model: string;
  options?: { id: number | string; name: string }[];
}
```

---

## Styling

Override CSS variables via `custom-class`. The **popup** renders outside the
calendar root (fixed position), so its `--popup-*` variables must be set on a
**shared ancestor** (e.g. `:root`).

```vue
<ScheduleForm custom-class="my-calendar" ... />
```

```css
/* Calendar root theming */
.my-calendar {
  --font-family: 'Inter', system-ui, sans-serif;

  /* Accent (active toggle, focus, "today") */
  --accent-color: #007bff;
  --accent-contrast: #ffffff;

  /* Grid & events */
  --grid-border-color: #cccccc;
  --calendar-primary-color: #a4d8ff;
  --event-border-radius: 8px;
  --event-title-color: #000000;
  --event-title-size: 16px;

  /* Buttons */
  --button-bg-color: var(--accent-color);
  --button-hover-bg-color: #0056b3;
  --button-color: var(--accent-contrast);
  --button-border-radius: 6px;

  /* Navigation */
  --arrow-button-bg: var(--accent-color);
  --arrow-button-color: var(--accent-contrast);
  --current-week-color: #000000;

  /* View toggle */
  --view-btn-active-bg: var(--accent-color);
  --view-btn-active-color: var(--accent-contrast);

  /* Month view */
  --month-cell-min-height: 96px;
  --month-today-bg: color-mix(in srgb, var(--accent-color) 12%, transparent);
  --month-chip-color: #000000;

  /* Drag tooltip / preview */
  --drag-tooltip-bg: var(--accent-color);
  --drag-tooltip-color: var(--accent-contrast);
  --event-preview-border: 2px dashed rgba(0, 0, 0, 0.35);

  /* Form */
  --form-bg-color: #ffffff;
  --label-color: #333333;
  --input-border: 1px solid #ccc;
  --input-border-radius: 6px;

  /* Danger (delete) */
  --danger-bg: #e53e3e;
  --danger-text: #ffffff;
}

/* Popup theming — must be global because the popup is teleported */
:root {
  --popup-bg: #ffffff;
  --popup-overlay-bg: rgba(0, 0, 0, 0.5);
  --popup-border-radius: 5px;
  --popup-title-color: #222222;
  --popup-label-color: #333333;
  --popup-input-focus-border: var(--accent-color, #007bff);
  --popup-save-bg: #007bff;
  --popup-save-hover-bg: #0056b3;
}
```

### Dark Mode

**Per component:**

```vue
<ScheduleForm :custom-class="isDark ? 'my-calendar dark' : 'my-calendar'" ... />
```

**Global:**

```js
document.documentElement.classList.add('dark');    // enable
document.documentElement.classList.remove('dark'); // disable
```

---

## Roadmap

- Read-only mode (`:readonly`) to disable creating and dragging
- `@range-change` event for lazy-loading events per visible range
- `event` scoped slot for fully custom event markup
- Recurring events (RRULE)
- "Jump to today" and a current-time indicator
- `allDay` event support in month view

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

[MIT](./LICENSE)