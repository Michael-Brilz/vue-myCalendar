<template>
  <div :class="['calendar-theme', customClass, { dark: isDark, 'is-dragging': isDraggingActive }]" :style="customStyles">

    <!-- CUSTOM FORM SLOT -->
    <slot
        name="form"
        :new-event="newEvent"
        :add-event="addEvent"
        :additional-fields="additionalFields"
        :labels="labelsAndSettings"
        :reset-form="resetForm"
    >
      <!-- DEFAULT FORM -->
      <form class="form-container" @submit.prevent="addEvent">
        <div class="form-group form-group--full">
          <label for="title" class="form-label">{{ labelsAndSettings.titleLabel }}:</label>
          <input id="title" v-model="newEvent.title" type="text" required class="form-input" :placeholder="labelsAndSettings.titleLabel" />
        </div>

        <div v-for="field in additionalFields" :key="field.id" class="form-group">
          <label :for="field.id" class="form-label">{{ field.label }}:</label>

          <div v-if="field.type === 'select'">
            <select :id="field.id" v-model="newEvent[field.model]" required class="form-select">
              <option v-for="option in field.options" :key="option.id" :value="option">
                {{ option.name || `${option.first_name} ${option.last_name}` }}
              </option>
            </select>
          </div>

          <div v-else>
            <input
                :id="field.id"
                v-model="newEvent[field.model]"
                :type="field.type"
                required
                class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="start" class="form-label">{{ labelsAndSettings.startTimeLabel }}:</label>
          <input id="start" v-model="newEvent.start" type="time" required class="form-input" />
        </div>

        <div class="form-group">
          <label for="end" class="form-label">{{ labelsAndSettings.endTimeLabel }}:</label>
          <input id="end" v-model="newEvent.end" type="time" required class="form-input" />
        </div>

        <div class="form-group">
          <label for="date" class="form-label">{{ labelsAndSettings.dateLabel }}:</label>
          <input id="date" v-model="newEvent.date" type="date" required class="form-input" />
        </div>

        <button type="submit" class="submit-button">
          {{ labelsAndSettings.submitButtonText }}
        </button>
      </form>
    </slot>

    <!-- CALENDAR -->
    <div class="calendar">
      <div class="navigation">
        <button type="button" class="today-btn" @click="goToToday">{{ labelsAndSettings.todayButtonLabel }}</button>
        <button type="button" class="arrow-button" @click="goPrev">&lt;</button>
        <span class="current-week">{{ headerLabel }}</span>
        <button type="button" class="arrow-button" @click="goNext">&gt;</button>

        <div class="view-toggle">
          <button
              type="button"
              :class="['view-btn', { active: activeView === 'week' }]"
              @click="activeView = 'week'"
          >
            {{ labelsAndSettings.weekViewLabel }}
          </button>
          <button
              type="button"
              :class="['view-btn', { active: activeView === 'month' }]"
              @click="activeView = 'month'"
          >
            {{ labelsAndSettings.monthViewLabel }}
          </button>
        </div>
      </div>

      <!-- WEEK VIEW -->
      <div v-if="activeView === 'week'" class="week-scroll-wrapper">
      <div class="hours-and-days">
        <div class="hours">
          <div class="empty-slot"></div>
          <div v-if="hasAllDayEventsThisWeek" class="allday-spacer"></div>
          <div v-for="hour in hours" :key="hour" class="hour">{{ hour }}</div>
        </div>

        <div class="weekdays-container">
          <ul class="weekdays">
            <li v-for="(day, index) in weekdays" :key="index" class="weekday">
              <span>{{ day }}</span>
              <span>{{ getDateForWeekday(index) }}</span>
            </li>
          </ul>

          <!-- All-day events row -->
          <div v-if="hasAllDayEventsThisWeek" class="allday-row">
            <div v-for="(day, dayIndex) in 7" :key="dayIndex" class="allday-day">
              <button
                  v-for="event in (weekAllDayEvents[getDateForWeekday(dayIndex)] || [])"
                  :key="'ad-' + event.id"
                  type="button"
                  class="allday-chip"
                  :style="{ backgroundColor: event.color || 'var(--calendar-primary-color)' }"
                  @click="showEventInfo(event)"
              >{{ event.title }}</button>
            </div>
          </div>

          <div class="days">
            <div
                v-for="(day, dayIndex) in 7"
                :key="dayIndex"
                class="day"
                :data-ymd="getDateForWeekday(dayIndex)"
                @click="onDayClick($event, getDateForWeekday(dayIndex))"
            >
              <div v-for="hour in hours" :key="hour" class="hour"></div>

              <!-- Current time indicator -->
              <div
                  v-if="getDateForWeekday(dayIndex) === todayYmd && currentTimeMinutes >= 0"
                  class="current-time-line"
                  :style="{ top: `${(currentTimeMinutes * PX_PER_HOUR) / 60}px` }"
              >
                <div class="current-time-dot"></div>
              </div>

              <!-- Live preview ghost -->
              <div
                  v-if="drag?.active && drag.mode === 'week' && drag.previewYmd === getDateForWeekday(dayIndex)"
                  :key="'preview-' + dayIndex"
                  class="event-preview"
                  :style="previewStyle"
              >
                {{ dragLabel }}
              </div>

              <div
                  v-for="event in (weekTimedEvents[getDateForWeekday(dayIndex)] || [])"
                  :key="'ev-' + event.id"
                  class="event"
                  :style="getEventStyle(event)"
                  @pointerdown="onEventPointerDown($event, event, getDateForWeekday(dayIndex))"
                  @click.stop="showEventInfo(event)"
              >
                <slot name="event" :event="event" :time-range="getEventTimeRange(event)">
                  <div class="event-inner">
                    <span class="event-title" :style="{ color: eventTitleColor, fontSize: eventTitleSize }">{{ event.title }}</span>
                    <span class="event-time-label">{{ getEventTimeRange(event) }}</span>
                    <div class="event-meta-row">
                      <span v-if="event.location" class="event-meta-badge">{{ event.location }}</span>
                      <span v-if="event.link" class="event-meta-badge event-meta-badge--link">&#x1F517;</span>
                      <span v-if="event.participants?.length" class="event-meta-badge">{{ event.participants.length }} &#128101;</span>
                    </div>
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div><!-- /week-scroll-wrapper -->

      <!-- MONTH VIEW -->
      <div v-else class="month-view">
        <div class="month-weekdays">
          <div v-for="(name, i) in monthWeekdayHeaders" :key="i" class="month-weekday">
            {{ name }}
          </div>
        </div>

        <div class="month-grid">
          <div
              v-for="cell in monthCells"
              :key="cell.ymd"
              :data-ymd="cell.ymd"
              :class="['month-cell', {
                'is-outside': !cell.inMonth,
                'is-today': cell.isToday,
                'drop-target': drag?.active && drag.mode === 'month' && drag.previewYmd === cell.ymd,
              }]"
              @click="onMonthCellClick($event, cell.ymd)"
          >
            <button type="button" class="month-daynum" @click.stop="goToDay(cell.ymd)">
              {{ cell.day }}
            </button>

            <div class="month-events">
              <button
                  v-for="event in cell.events.slice(0, MONTH_MAX_VISIBLE)"
                  :key="'mev-' + event.id"
                  type="button"
                  class="month-chip"
                  :style="{ backgroundColor: event.color || 'var(--calendar-primary-color)' }"
                  @pointerdown="onEventPointerDown($event, event, cell.ymd)"
                  @click.stop="showEventInfo(event)"
              >
                <span class="month-chip-time">{{ chipTime(event) }}</span>
                <span class="month-chip-title">{{ event.title }}</span>
              </button>

              <button
                  v-if="cell.events.length > MONTH_MAX_VISIBLE"
                  type="button"
                  class="month-more"
                  @click="goToDay(cell.ymd)"
              >
                +{{ cell.events.length - MONTH_MAX_VISIBLE }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating time/date tooltip that follows the cursor while dragging -->
    <div
        v-if="drag?.active"
        class="drag-time-tooltip"
        :style="{ left: (drag.cursorX + 14) + 'px', top: (drag.cursorY + 14) + 'px' }"
    >
      {{ dragLabel }}
    </div>

    <!-- CUSTOM POPUP SLOT -->
    <slot name="popup-calendar" v-if="$slots['popup-calendar']"></slot>

    <!-- DEFAULT POPUP -->
    <Popup
        v-else
        :visible="effectivePopupVisible"
        :eventData="effectivePopupEvent"
        :createMode="isCreateMode"
        :popupFields="popupFields || []"
        :readonly="props.readonly"
        closeButtonText="Close"
        :todosLabel="labelsAndSettings.todosLabel || 'To-Do'"
        :participantsLabel="labelsAndSettings.participantsLabel || 'Teammates'"
        :todos="effectivePopupEvent.todos || []"
        :participants="effectivePopupEvent.participants || []"
        :todoPlaceholder="placeholderSettings.todo || 'New To-do...'"
        :participantPlaceholder="placeholderSettings.participant || 'Add Participant...'"
        @update:todos="(val) => emit('update:todos', val)"
        @update:participants="(val) => emit('update:participants', val)"
        @close-popup="handlePopupClose"
        @handle-delete="emitDeleteEvent"
        @update-event="handlePopupUpdate"
        @submit-event="handleCreateFromPopup"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onBeforeUnmount, useSlots } from 'vue';
import Popup from './Popup.vue';
import myLogoSrc from '../assets/icons8-info.svg';
import { Field, EventInfo, LabelsAndSettings } from '@/types/EventInterfaces';
import {
  zonedParts,
  zonedYmd,
  minutesOfDayInZone,
  zonedWallTimeToUtc,
  startOfWeekYmd,
  addDaysYmd,
  formatHm,
  monthGridYmds,
  daysInMonth,
} from '@/utils/calendarTime';

type CalendarView = 'week' | 'month';

// ============================================================================
// Props
// ============================================================================

const props = withDefaults(
    defineProps<{
      schedules: EventInfo[];
      additionalFields: Field[];
      customClass?: string;
      customStyles?: Record<string, any>;
      weekdays?: string[];
      eventTitleColor?: string;
      eventTitleSize?: string;
      popupFields?: string[];
      labelsAndSettings?: LabelsAndSettings;
      placeholderSettings?: {
        todo?: string;
        participant?: string;
      };
      popupVisible?: boolean;
      popupEvent?: EventInfo | null;
      timeZone?: string;
      weekStartsOn?: 0 | 1;
      view?: CalendarView;
      readonly?: boolean;
    }>(),
    {
      customClass: '',
      customStyles: () => ({}),
      weekdays: () => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      eventTitleColor: '#000',
      eventTitleSize: '16px',
      popupFields: () => [],
      labelsAndSettings: () => ({
        startTimeLabel: 'Start Time',
        endTimeLabel: 'End Time',
        dateLabel: 'Date',
        submitButtonText: 'Add Entry',
        calendarWeekLabel: 'CW',
      }),
      placeholderSettings: () => ({}),
      popupVisible: false,
      popupEvent: null,
      timeZone: () => Intl.DateTimeFormat().resolvedOptions().timeZone,
      weekStartsOn: 1,
      view: undefined,
      readonly: false,
    }
);

// ============================================================================
// Emits
// ============================================================================

const emit = defineEmits<{
  'submit-event': [event: EventInfo];
  'handle-delete': [eventId: number];
  'update-event': [event: EventInfo];
  'show-info': [event: EventInfo];
  'close-popup': [];
  'update:todos': [payload: { todos: string[]; eventId: number }];
  'update:participants': [payload: { participants: string[]; eventId: number }];
  'update:view': [view: CalendarView];
  'slot-click': [payload: { date: string; start?: string; end?: string }];
  'range-change': [payload: { start: string; end: string; view: CalendarView }];
}>();

// ============================================================================
// Slots
// ============================================================================

const slots = useSlots();

// ============================================================================
// State
// ============================================================================

const isDark = ref(false);
const events = ref<Record<string, EventInfo[]>>({});
const newEvent = ref<Partial<EventInfo>>({
  start: '',
  end: '',
  date: '',
  color: '',
  title: '',
  description: '',
});

const anchorDate = ref(new Date());
const internalView = ref<CalendarView>('week');

const MONTH_MAX_VISIBLE = 3;
const DRAG_THRESHOLD_PX = 4;
const PX_PER_HOUR = 40;

const hours = ref(
    Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00')
);

// ---- Drag state (pointer-based) --------------------------------------------
interface DragState {
  event: EventInfo;
  pointerId: number;
  startX: number;
  startY: number;
  grabOffsetMinutes: number; // where inside the event it was grabbed (week only)
  durationMin: number;
  mode: CalendarView;
  active: boolean; // true once the move threshold is passed
  previewYmd: string;
  previewStartMin: number; // week only
  cursorX: number;
  cursorY: number;
}

const drag = ref<DragState | null>(null);

// Suppresses the click that browsers may synthesize right after a drag,
// so a move doesn't accidentally open the popup.
let dragJustEnded = false;

// Current time indicator
const currentTimeMinutes = ref(-1);
let timeUpdateInterval: ReturnType<typeof setInterval> | null = null;

// Internal create-mode popup state
const internalCreateVisible = ref(false);
const internalCreateEvent = ref<EventInfo>({
  id: 0, title: '', date: '', start: '', end: '', color: '', todos: [], participants: [],
});

// ============================================================================
// Computed
// ============================================================================

const eventTitleColor = computed(() => props.eventTitleColor);
const eventTitleSize = computed(() => props.eventTitleSize);
const additionalFields = computed(() => props.additionalFields);

const timeZone = computed(() => props.timeZone);
const weekStartsOn = computed<0 | 1>(() => props.weekStartsOn);

const activeView = computed<CalendarView>({
  get: () => props.view ?? internalView.value,
  set: (value) => {
    internalView.value = value;
    emit('update:view', value);
  },
});

const weekdays = computed(() => {
  const list = props.weekdays;
  return weekStartsOn.value === 1 ? list : [list[6], ...list.slice(0, 6)];
});

const labelsAndSettings = computed(() => ({
  startTimeLabel: props.labelsAndSettings?.startTimeLabel || 'Start Time',
  endTimeLabel: props.labelsAndSettings?.endTimeLabel || 'End Time',
  dateLabel: props.labelsAndSettings?.dateLabel || 'Date',
  submitButtonText: props.labelsAndSettings?.submitButtonText || 'Add Entry',
  calendarWeekLabel: props.labelsAndSettings?.calendarWeekLabel || 'CW',
  todosLabel: props.labelsAndSettings?.todosLabel,
  participantsLabel: props.labelsAndSettings?.participantsLabel,
  weekViewLabel: props.labelsAndSettings?.weekViewLabel || 'Week',
  monthViewLabel: props.labelsAndSettings?.monthViewLabel || 'Month',
  titleLabel: props.labelsAndSettings?.titleLabel || 'Title',
  todayButtonLabel: props.labelsAndSettings?.todayButtonLabel || 'Today',
}));

const placeholderSettings = computed(() => props.placeholderSettings || {});
const popupVisible = computed(() => props.popupVisible);
const popupEvent = computed(() => props.popupEvent);

// Merges external popup state with internal create-mode popup
const isCreateMode = computed(() => internalCreateVisible.value);
const effectivePopupVisible = computed(() => props.popupVisible || internalCreateVisible.value);
const effectivePopupEvent = computed<EventInfo>(() =>
  internalCreateVisible.value
    ? internalCreateEvent.value
    : (props.popupEvent ?? { id: 0, title: '' } as EventInfo)
);

const weekStartYmd = computed(() =>
    startOfWeekYmd(anchorDate.value, timeZone.value, weekStartsOn.value)
);

const headerLabel = computed(() => {
  if (activeView.value === 'month') {
    return new Intl.DateTimeFormat(undefined, {
      month: 'long',
      year: 'numeric',
      timeZone: timeZone.value,
    }).format(anchorDate.value);
  }
  return `${labelsAndSettings.value.calendarWeekLabel} ${getCurrentWeekNumber()}`;
});

const monthCells = computed(() => {
  const parts = zonedParts(anchorDate.value, timeZone.value);
  const ymds = monthGridYmds(parts.year, parts.month, weekStartsOn.value);
  const todayYmd = zonedYmd(new Date(), timeZone.value);

  return ymds.map((ymd) => {
    const [, m, d] = ymd.split('-').map(Number);
    return {
      ymd,
      day: d,
      inMonth: m === parts.month,
      isToday: ymd === todayYmd,
      events: events.value[ymd] ?? [],
    };
  });
});

const monthWeekdayHeaders = computed(() =>
    monthCells.value.slice(0, 7).map((cell) => {
      const [y, m, d] = cell.ymd.split('-').map(Number);
      return new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(y, m - 1, d, 12)));
    })
);

// True while an actual drag (past threshold) is in progress.
const isDraggingActive = computed(() => !!drag.value?.active);

// Ghost style for the week preview.
const previewStyle = computed(() => {
  const state = drag.value;
  if (!state || !state.active || state.mode !== 'week') return {};
  const top = (state.previewStartMin * PX_PER_HOUR) / 60;
  const height = (Math.max(state.durationMin, 15) * PX_PER_HOUR) / 60;
  return {
    position: 'absolute' as const,
    top: `${top}px`,
    height: `${height}px`,
    left: 0,
    right: 0,
    opacity: 0.55,
    pointerEvents: 'none' as const,
    borderRadius: 'var(--event-border-radius)',
    background: state.event.color || 'var(--calendar-primary-color)',
    zIndex: 5,
  };
});

// Tooltip text: time range in week, target date in month.
const dragLabel = computed(() => {
  const state = drag.value;
  if (!state || !state.active) return '';

  if (state.mode === 'week') {
    const endMin = state.previewStartMin + state.durationMin;
    return `${fmtMinutes(state.previewStartMin)} – ${fmtMinutes(endMin)}`;
  }

  const [y, m, d] = state.previewYmd.split('-').map(Number);
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
});

// ============================================================================
// Time normalization
// ============================================================================

function eventInstants(event: EventInfo): { start: Date; end: Date } | null {
  if (event.startsAt && event.endsAt) {
    const start = new Date(event.startsAt);
    const end = new Date(event.endsAt);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return { start, end };
    }
  }

  if (event.date && event.start && event.end) {
    const [sy, sm, sd] = event.date.split('-').map(Number);
    const [sh, smin] = event.start.split(':').map(Number);
    const [eh, emin] = event.end.split(':').map(Number);

    return {
      start: zonedWallTimeToUtc(sy, sm, sd, sh, smin, timeZone.value),
      end: zonedWallTimeToUtc(sy, sm, sd, eh, emin, timeZone.value),
    };
  }

  return null;
}

// Minutes-of-day -> 'HH:MM'.
function fmtMinutes(total: number): string {
  const clamped = Math.max(0, Math.min(total, 1439));
  const hh = String(Math.floor(clamped / 60)).padStart(2, '0');
  const mm = String(clamped % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

// ============================================================================
// Overlap layout (week view)
// ============================================================================

function computeDayLayout(
    dayEvents: EventInfo[]
): Record<number, { col: number; cols: number }> {
  const items = dayEvents
      .map((event) => {
        const instants = eventInstants(event);
        if (!instants) return null;
        return {
          id: event.id,
          start: minutesOfDayInZone(instants.start, timeZone.value),
          end: minutesOfDayInZone(instants.end, timeZone.value),
        };
      })
      .filter((x): x is { id: number; start: number; end: number } => x !== null)
      .sort((a, b) => a.start - b.start || a.end - b.end);

  const result: Record<number, { col: number; cols: number }> = {};
  let cluster: { id: number; start: number; end: number }[] = [];
  let clusterEnd = -Infinity;

  const flush = (group: typeof cluster) => {
    const columnEnds: number[] = [];
    const colOf: Record<number, number> = {};

    for (const item of group) {
      let placed = false;
      for (let c = 0; c < columnEnds.length; c++) {
        if (columnEnds[c] <= item.start) {
          columnEnds[c] = item.end;
          colOf[item.id] = c;
          placed = true;
          break;
        }
      }
      if (!placed) {
        columnEnds.push(item.end);
        colOf[item.id] = columnEnds.length - 1;
      }
    }

    const cols = columnEnds.length;
    for (const item of group) {
      result[item.id] = { col: colOf[item.id], cols };
    }
  };

  for (const item of items) {
    if (cluster.length && item.start >= clusterEnd) {
      flush(cluster);
      cluster = [];
      clusterEnd = -Infinity;
    }
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  if (cluster.length) flush(cluster);

  return result;
}

const todayYmd = computed(() => zonedYmd(new Date(), timeZone.value));

// Split events for week view: timed events go in the grid, allDay events in the banner
const weekTimedEvents = computed(() => {
  const result: Record<string, EventInfo[]> = {};
  for (const [ymd, evs] of Object.entries(events.value)) {
    const timed = evs.filter(e => !e.allDay);
    if (timed.length) result[ymd] = timed;
  }
  return result;
});

const weekAllDayEvents = computed(() => {
  const result: Record<string, EventInfo[]> = {};
  for (const [ymd, evs] of Object.entries(events.value)) {
    const allDay = evs.filter(e => e.allDay);
    if (allDay.length) result[ymd] = allDay;
  }
  return result;
});

const hasAllDayEventsThisWeek = computed(() =>
  Array.from({ length: 7 }, (_, i) => getDateForWeekday(i))
    .some(ymd => (weekAllDayEvents.value[ymd] ?? []).length > 0)
);

const overlapLayout = computed(() => {
  const map: Record<number, { col: number; cols: number }> = {};
  for (const ymd of Object.keys(weekTimedEvents.value)) {
    Object.assign(map, computeDayLayout(weekTimedEvents.value[ymd]));
  }
  return map;
});

// ============================================================================
// Methods - Form
// ============================================================================

const resetForm = () => {
  newEvent.value = {
    start: '',
    end: '',
    date: '',
    color: '',
    title: '',
    description: '',
  };

  props.additionalFields.forEach((field) => {
    (newEvent.value as any)[field.model] = '';
  });
};

const addEvent = (externalEvent?: Partial<EventInfo>) => {
  const eventData = externalEvent || newEvent.value;

  const event: Partial<EventInfo> = {
    title: eventData.title,
    start: eventData.start,
    end: eventData.end,
    date: eventData.date,
    info: eventData.info,
    color: eventData.color,
    description: eventData.description,
  };

  props.additionalFields.forEach((field) => {
    event[field.model] = eventData[field.model];
  });

  emit('submit-event', event as EventInfo);
  resetForm();
};

// ============================================================================
// Methods - Navigation
// ============================================================================

const getDateForWeekday = (weekdayIndex: number): string => {
  return addDaysYmd(weekStartYmd.value, weekdayIndex);
};

const getCurrentWeekNumber = (): number => {
  const parts = zonedParts(anchorDate.value, timeZone.value);
  const startOfYear = new Date(Date.UTC(parts.year, 0, 1));
  const current = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  const pastDays = (current.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDays + startOfYear.getUTCDay() + 1) / 7);
};

const shiftWeek = (direction: number) => {
  anchorDate.value = new Date(anchorDate.value.getTime() + direction * 7 * 86400000);
};

const shiftMonth = (direction: number) => {
  const parts = zonedParts(anchorDate.value, timeZone.value);
  let month = parts.month + direction;
  let year = parts.year;
  while (month > 12) { month -= 12; year += 1; }
  while (month < 1) { month += 12; year -= 1; }
  const day = Math.min(parts.day, daysInMonth(year, month));
  anchorDate.value = zonedWallTimeToUtc(year, month, day, 12, 0, timeZone.value);
};

const goPrev = () => (activeView.value === 'month' ? shiftMonth(-1) : shiftWeek(-1));
const goNext = () => (activeView.value === 'month' ? shiftMonth(1) : shiftWeek(1));

const goToDay = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number);
  anchorDate.value = zonedWallTimeToUtc(y, m, d, 12, 0, timeZone.value);
  activeView.value = 'week';
};

// ============================================================================
// Methods - Event Styling
// ============================================================================

const getEventStyle = (event: EventInfo) => {
  const instants = eventInstants(event);
  if (!instants) return { display: 'none' };

  const startMin = minutesOfDayInZone(instants.start, timeZone.value);
  const endMin = minutesOfDayInZone(instants.end, timeZone.value);

  const top = (startMin * PX_PER_HOUR) / 60;
  const height = (Math.max(endMin - startMin, 15) * PX_PER_HOUR) / 60;

  const layout = overlapLayout.value[event.id] ?? { col: 0, cols: 1 };
  const widthPct = 100 / layout.cols;
  const leftPct = widthPct * layout.col;

  // Dim the event that is currently being dragged.
  const dimmed = drag.value?.active && drag.value.event.id === event.id;

  return {
    backgroundColor: event.color || 'var(--calendar-primary-color)',
    top: `${top}px`,
    height: `${height}px`,
    position: 'absolute' as const,
    left: `${leftPct}%`,
    width: `calc(${widthPct}% - 4px)`,
    right: 'auto',
    zIndex: 1,
    opacity: dimmed ? 0.35 : 1,
    borderRadius: 'var(--event-border-radius)',
  };
};

const chipTime = (event: EventInfo): string => {
  const instants = eventInstants(event);
  if (!instants) return '';
  return formatHm(instants.start, timeZone.value);
};

const getEventTimeRange = (event: EventInfo): string => {
  const instants = eventInstants(event);
  if (!instants) return '';
  return `${formatHm(instants.start, timeZone.value)} – ${formatHm(instants.end, timeZone.value)}`;
};

const goToToday = () => { anchorDate.value = new Date(); };

const onDayClick = (e: MouseEvent, ymd: string) => {
  if (props.readonly) return;
  if (dragJustEnded) return;
  if ((e.target as HTMLElement).closest('.event, .allday-chip')) return;

  const dayEl = e.currentTarget as HTMLElement;
  const rect = dayEl.getBoundingClientRect();
  const rawMinutes = ((e.clientY - rect.top) / PX_PER_HOUR) * 60;
  const snapped = Math.round(rawMinutes / 15) * 15;
  const startMin = Math.max(0, Math.min(snapped, 1410));
  const endMin = Math.min(startMin + 60, 1440);
  const fmt = (m: number) =>
    `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  // Pre-fill the form as well (for custom #form slot users)
  newEvent.value.date = ymd;
  newEvent.value.start = fmt(startMin);
  newEvent.value.end = fmt(endMin);

  // Open create popup
  internalCreateEvent.value = {
    id: 0, title: '', date: ymd,
    start: fmt(startMin), end: fmt(endMin),
    color: '', todos: [], participants: [],
  };
  internalCreateVisible.value = true;

  emit('slot-click', { date: ymd, start: fmt(startMin), end: fmt(endMin) });
};

const onMonthCellClick = (e: MouseEvent, ymd: string) => {
  if (props.readonly) return;
  if ((e.target as HTMLElement).closest('.month-chip, .month-daynum, .month-more')) return;

  newEvent.value.date = ymd;

  internalCreateEvent.value = {
    id: 0, title: '', date: ymd,
    start: '', end: '',
    color: '', todos: [], participants: [],
  };
  internalCreateVisible.value = true;

  emit('slot-click', { date: ymd });
};

// ============================================================================
// Methods - Pointer Drag & Drop
// ============================================================================

// Start a potential drag. Does not capture or preventDefault yet, so a
// simple tap/click (info button, month chip) still behaves normally.
const onEventPointerDown = (e: PointerEvent, event: EventInfo, ymd: string) => {
  if (e.button !== 0 && e.pointerType === 'mouse') return; // left button only

  const instants = eventInstants(event);
  if (!instants) return;

  const startMin = minutesOfDayInZone(instants.start, timeZone.value);
  const endMin = minutesOfDayInZone(instants.end, timeZone.value);

  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const grabY = e.clientY - rect.top;

  drag.value = {
    event,
    pointerId: e.pointerId,
    startX: e.clientX,
    startY: e.clientY,
    grabOffsetMinutes: activeView.value === 'week' ? (grabY * 60) / PX_PER_HOUR : 0,
    durationMin: endMin - startMin,
    mode: activeView.value,
    active: false,
    previewYmd: ymd,
    previewStartMin: startMin,
    cursorX: e.clientX,
    cursorY: e.clientY,
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerCancel);
};

const onPointerMove = (e: PointerEvent) => {
  const state = drag.value;
  if (!state || e.pointerId !== state.pointerId) return;

  // Pass the threshold before treating it as a real drag.
  if (!state.active) {
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
    state.active = true;
  }

  e.preventDefault();
  state.cursorX = e.clientX;
  state.cursorY = e.clientY;

  // Find the day column / month cell under the cursor via its data-ymd.
  const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
  const container = under?.closest('[data-ymd]') as HTMLElement | null;
  if (!container) return;

  state.previewYmd = container.getAttribute('data-ymd') as string;

  if (state.mode === 'week') {
    const rect = container.getBoundingClientRect();
    const overY = e.clientY - rect.top;
    const raw = (overY * 60) / PX_PER_HOUR - state.grabOffsetMinutes;
    const clamped = Math.max(0, Math.min(raw, 1440 - state.durationMin));
    state.previewStartMin = Math.round(clamped / 15) * 15;
  }
};

const onPointerUp = (e: PointerEvent) => {
  const state = drag.value;
  if (!state || e.pointerId !== state.pointerId) return;

  removeDragListeners();

  if (state.active) {
    commitDrag(state);
    // Suppress the synthetic click that follows the drag.
    dragJustEnded = true;
    setTimeout(() => { dragJustEnded = false; }, 50);
  }

  drag.value = null;
};

const onPointerCancel = () => {
  removeDragListeners();
  drag.value = null;
};

const removeDragListeners = () => {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerCancel);
};

// Turn the preview into an actual moved event (UTC + legacy fields).
const commitDrag = (state: DragState) => {
  const [y, m, d] = state.previewYmd.split('-').map(Number);

  let startMinInDay: number;
  if (state.mode === 'week') {
    startMinInDay = state.previewStartMin;
  } else {
    // Month: change the day, keep the original time of day.
    const instants = eventInstants(state.event);
    if (!instants) return;
    startMinInDay = minutesOfDayInZone(instants.start, timeZone.value);
  }

  const newStartUtc = zonedWallTimeToUtc(
      y, m, d,
      Math.floor(startMinInDay / 60),
      startMinInDay % 60,
      timeZone.value,
  );
  const newEndUtc = new Date(newStartUtc.getTime() + state.durationMin * 60000);

  emitMovedEvent(state.event, newStartUtc, newEndUtc);
};

const emitMovedEvent = (source: EventInfo, startUtc: Date, endUtc: Date) => {
  emit('update-event', {
    ...source,
    startsAt: startUtc.toISOString(),
    endsAt: endUtc.toISOString(),
    date: zonedYmd(startUtc, timeZone.value),
    start: formatHm(startUtc, timeZone.value),
    end: formatHm(endUtc, timeZone.value),
  });
};

// ============================================================================
// Methods - Popup
// ============================================================================

// Guarded so a completed drag doesn't also open the popup.
const showEventInfo = (event: EventInfo) => {
  if (dragJustEnded) return;
  emit('show-info', event);
};

const handlePopupClose = () => {
  if (internalCreateVisible.value) {
    internalCreateVisible.value = false;
  } else {
    emit('close-popup');
  }
};

const handleCreateFromPopup = (event: EventInfo) => {
  internalCreateVisible.value = false;
  emit('submit-event', event);
};

const emitDeleteEvent = (eventId: number) => {
  emit('handle-delete', eventId);
};

const handlePopupUpdate = (updated: EventInfo) => {
  emit('update-event', updated);
};

// ============================================================================
// Watchers
// ============================================================================

const loadEvents = () => {
  const grouped: Record<string, EventInfo[]> = {};

  for (const event of props.schedules) {
    const instants = eventInstants(event);
    if (!instants) continue;

    const ymd = zonedYmd(instants.start, timeZone.value);
    (grouped[ymd] ??= []).push(event);
  }

  events.value = grouped;
};

watchEffect(loadEvents);

watchEffect(() => {
  let start: string, end: string;
  if (activeView.value === 'week') {
    start = weekStartYmd.value;
    end = addDaysYmd(weekStartYmd.value, 6);
  } else {
    const cells = monthCells.value;
    start = cells[0]?.ymd ?? weekStartYmd.value;
    end = cells[cells.length - 1]?.ymd ?? weekStartYmd.value;
  }
  emit('range-change', { start, end, view: activeView.value });
});

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(() => {
  props.additionalFields.forEach((field) => {
    (newEvent.value as any)[field.model] = '';
  });

  if (typeof window !== 'undefined') {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (mq?.matches) isDark.value = true;

    currentTimeMinutes.value = minutesOfDayInZone(new Date(), timeZone.value);
    timeUpdateInterval = setInterval(() => {
      currentTimeMinutes.value = minutesOfDayInZone(new Date(), timeZone.value);
    }, 60000);
  }
});

onBeforeUnmount(() => {
  removeDragListeners();
  if (timeUpdateInterval) clearInterval(timeUpdateInterval);
});

// ============================================================================
// Expose (for external access via ref)
// ============================================================================

defineExpose({
  newEvent,
  addEvent,
  resetForm,
});
</script>

<style>
/* ============================================================================
   LIGHT THEME DEFAULTS
============================================================================ */
.calendar-theme {
  --body-bg-color: #ffffff;
  --body-text-color: #000000;
  --font-family: inherit;

  --form-bg-color: #ffffff;
  --form-padding: 1rem;
  --form-border-radius: 8px;
  --form-border: 1px solid #ccc;
  --form-gap: 1rem;

  --label-color: #333333;
  --label-font-weight: bold;
  --label-font-size: 1rem;

  --input-height: 40px;
  --input-padding: 0.5rem;
  --input-font-size: 1rem;
  --input-border: 1px solid #ccc;
  --input-border-radius: 6px;
  --input-bg-color: #ffffff;
  --input-color: #000000;
  --input-focus-border-color: var(--accent-color);
  --input-focus-ring: rgba(0, 123, 255, 0.15);

  --accent-color: #007bff;
  --accent-contrast: #ffffff;

  --calendar-primary-color: #a4d8ff;
  --grid-border-color: #cccccc;

  --button-bg-color: var(--accent-color);
  --button-hover-bg-color: #0056b3;
  --button-color: var(--accent-contrast);
  --button-padding: 0.6rem 1rem;
  --button-border-radius: 6px;
  --button-font-size: 1rem;

  --event-border-radius: 8px;
  --event-title-color: #000000;
  --event-title-size: 16px;
  --event-font-size: 12px;
  --event-padding: 2px;

  --event-preview-border: 2px dashed rgba(0, 0, 0, 0.35);
  --event-preview-color: #000000;

  --arrow-button-bg: var(--accent-color);
  --arrow-button-color: var(--accent-contrast);
  --current-week-color: #000000;
  --current-week-size: 1.2rem;

  --view-toggle-bg: var(--form-bg-color);
  --view-toggle-border: 1px solid var(--grid-border-color);
  --view-btn-color: var(--body-text-color);
  --view-btn-active-bg: var(--accent-color);
  --view-btn-active-color: var(--accent-contrast);

  --month-cell-border: 1px solid var(--grid-border-color);
  --month-cell-min-height: 96px;
  --month-weekday-color: var(--body-text-color);
  --month-weekday-size: 0.8125rem;
  --month-daynum-color: var(--body-text-color);
  --month-daynum-size: 0.8125rem;
  --month-today-bg: color-mix(in srgb, var(--accent-color) 12%, transparent);
  --month-today-daynum-bg: var(--accent-color);
  --month-today-daynum-color: var(--accent-contrast);
  --month-chip-color: #000000;
  --month-chip-size: 0.6875rem;
  --month-chip-radius: 4px;
  --month-outside-opacity: 0.4;
  --month-drop-target-outline: 2px solid var(--accent-color);

  --drag-tooltip-bg: var(--accent-color);
  --drag-tooltip-color: var(--accent-contrast);
  --drag-tooltip-radius: 6px;
  --drag-tooltip-size: 0.8125rem;

  --popup-bg: #ffffff;
  --popup-overlay-bg: rgba(0, 0, 0, 0.5);
  --popup-border-radius: 5px;
  --popup-title-color: #222222;
  --popup-title-size: 1.5rem;
  --popup-text-color: var(--body-text-color);
  --popup-label-color: #333333;
  --popup-input-color: var(--body-text-color);
  --popup-input-border: 1px solid var(--grid-border-color);
  --popup-input-focus-border: var(--accent-color);
  --popup-icon-color: #444444;
  --popup-icon-hover-color: #646262;
  --popup-inline-btn-bg: #ffffff;
  --popup-inline-btn-color: #444444;
  --popup-inline-btn-hover-color: #646262;
  --popup-save-bg: var(--button-bg-color);
  --popup-save-color: var(--button-color);
  --popup-save-hover-bg: var(--button-hover-bg-color);

  --danger-bg: #e53e3e;
  --danger-text: #ffffff;

  color: var(--body-text-color);
  font-family: var(--font-family);
  background-color: var(--body-bg-color);
}

/* ============================================================================
   DARK THEME
============================================================================ */
.calendar-theme.dark {
  --body-bg-color: #121212;
  --body-text-color: #ffffff;

  --form-bg-color: #1c1c1c;
  --form-border: 1px solid rgba(255, 255, 255, 0.1);
  --label-color: #ffffff;

  --input-bg-color: #1e1e1e;
  --input-border: 1px solid rgba(255, 255, 255, 0.15);
  --input-color: #ffffff;

  --accent-color: #D2F7D8;
  --accent-contrast: #121212;

  --calendar-primary-color: #D2F7D8;
  --grid-border-color: rgba(255, 255, 255, 0.12);

  --button-bg-color: var(--accent-color);
  --button-hover-bg-color: #b2e7c0;
  --button-color: var(--accent-contrast);

  --current-week-color: #ffffff;

  --event-title-color: #000000;
  --event-preview-color: #000000;

  --month-chip-color: #000000;

  --popup-bg: #1e1e1e;
  --popup-overlay-bg: rgba(0, 0, 0, 0.7);
  --popup-title-color: #ffffff;
  --popup-label-color: #aaaaaa;
  --popup-input-color: #ffffff;
  --popup-icon-color: #cccccc;
  --popup-icon-hover-color: #ffffff;
  --popup-inline-btn-bg: #2a2a2a;
  --popup-inline-btn-color: #dddddd;
  --popup-save-bg: var(--accent-color);
  --popup-save-color: var(--accent-contrast);
  --popup-save-hover-bg: #b2e7c0;
}

/* ============================================================================
   SYSTEM DARK PREFERENCE
============================================================================ */
@media (prefers-color-scheme: dark) {
  .calendar-theme:not(.dark):not(.light) {
    --body-bg-color: #121212;
    --body-text-color: #ffffff;
    /* background-color is already applied via var(--body-bg-color) on .calendar-theme */

    --form-bg-color: #1c1c1c;
    --form-border: 1px solid rgba(255, 255, 255, 0.1);
    --label-color: #ffffff;

    --input-bg-color: #1e1e1e;
    --input-border: 1px solid rgba(255, 255, 255, 0.15);
    --input-color: #ffffff;

    --accent-color: #D2F7D8;
    --accent-contrast: #121212;

    --calendar-primary-color: #D2F7D8;
    --grid-border-color: rgba(255, 255, 255, 0.12);

    --button-bg-color: var(--accent-color);
    --button-hover-bg-color: #b2e7c0;
    --button-color: var(--accent-contrast);

    --current-week-color: #ffffff;

    --popup-bg: rgba(18, 18, 18, 0.95);
    --popup-overlay-bg: rgba(0, 0, 0, 0.7);
    --popup-title-color: #ffffff;
    --popup-label-color: #ffffff;
  }
}

/* ============================================================================
   COMPONENT STYLES
============================================================================ */
.calendar-theme .small-logo {
  width: 20px;
  height: 20px;
}

.calendar-theme .form-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--form-gap);
  background-color: var(--form-bg-color);
  padding: var(--form-padding);
  border-radius: var(--form-border-radius);
  border: var(--form-border);
  margin-bottom: 20px;
}

.calendar-theme .form-group {
  flex: 1;
  min-width: 200px;
  margin-bottom: 10px;
}

.calendar-theme .form-label {
  display: block;
  color: var(--label-color);
  font-weight: var(--label-font-weight);
  font-size: var(--label-font-size);
  margin-bottom: 4px;
}

.calendar-theme .form-input,
.calendar-theme .form-select {
  width: 100%;
  height: var(--input-height);
  padding: var(--input-padding);
  font-size: var(--input-font-size);
  border: var(--input-border);
  border-radius: var(--input-border-radius);
  box-sizing: border-box;
  appearance: none;
  background: var(--input-bg-color);
  color: var(--input-color);
}

.calendar-theme .form-input:focus,
.calendar-theme .form-select:focus {
  outline: none;
  border-color: var(--input-focus-border-color);
  box-shadow: 0 0 0 2px var(--input-focus-ring);
}

.calendar-theme .submit-button {
  background-color: var(--button-bg-color);
  color: var(--button-color);
  padding: var(--button-padding);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: var(--button-font-size);
}

.calendar-theme .submit-button:hover {
  background-color: var(--button-hover-bg-color);
}

.calendar-theme .calendar {
  display: flex;
  flex-direction: column;
}

.calendar-theme .hours-and-days {
  display: flex;
  align-items: stretch;
}

.calendar-theme .hours {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 50px;
  height: 100%;
}

.calendar-theme .hours .hour {
  min-height: 40px;
  border-bottom: 1px solid var(--grid-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-grow: 1;
}

.calendar-theme .weekdays-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.calendar-theme .weekdays {
  list-style-type: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-bottom: 1px solid var(--grid-border-color);
  margin: 0;
  height: 40px;
}

.calendar-theme .weekday {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.calendar-theme .days {
  display: flex;
  flex-grow: 1;
}

.calendar-theme .day {
  flex: 1;
  border-left: 1px solid var(--grid-border-color);
  position: relative;
}

.calendar-theme .day .hour {
  min-height: 40px;
  border-bottom: 1px solid var(--grid-border-color);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  flex-grow: 1;
}

.calendar-theme .event {
  background-color: var(--calendar-primary-color);
  padding: 0;
  font-size: var(--event-font-size);
  border-radius: var(--event-border-radius);
  width: 95%;
  box-sizing: border-box;
  position: absolute;
  cursor: grab;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  overflow: hidden;
  border-left: 3px solid rgba(0, 0, 0, 0.18);
}

.calendar-theme .event:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.calendar-theme .event:active {
  cursor: grabbing;
}

.calendar-theme .event-inner {
  display: flex;
  flex-direction: column;
  padding: 4px 6px;
  height: 100%;
  overflow: hidden;
  gap: 1px;
}

.calendar-theme .event-title {
  font-weight: 600;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.calendar-theme .event-time-label {
  font-size: 0.7rem;
  opacity: 0.75;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.2;
}

.calendar-theme .event-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-top: 2px;
}

.calendar-theme .event-meta-badge {
  font-size: 0.65rem;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  padding: 0 4px;
  white-space: nowrap;
  line-height: 1.5;
}

.calendar-theme .empty-slot {
  height: 40px;
}

.calendar-theme.is-dragging {
  user-select: none;
  -webkit-user-select: none;
}

.calendar-theme .event,
.calendar-theme .month-chip {
  touch-action: none;
}

.calendar-theme .event-preview {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2px 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--event-preview-color);
  border: var(--event-preview-border);
  box-sizing: border-box;
}

.calendar-theme .drag-time-tooltip {
  position: fixed;
  z-index: 2000;
  pointer-events: none;
  padding: 4px 9px;
  border-radius: var(--drag-tooltip-radius);
  background: var(--drag-tooltip-bg);
  color: var(--drag-tooltip-color);
  font-size: var(--drag-tooltip-size);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
}

.calendar-theme .navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-theme .arrow-button {
  background-color: var(--arrow-button-bg);
  color: var(--arrow-button-color);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin: 0 1rem;
  transition: background-color 0.15s ease;
}

.calendar-theme .arrow-button:hover {
  background-color: var(--button-hover-bg-color);
}

.calendar-theme .current-week {
  font-size: var(--current-week-size);
  font-weight: bold;
  color: var(--current-week-color);
}

.calendar-theme .view-toggle {
  display: inline-flex;
  gap: 4px;
  margin-left: 1.5rem;
  padding: 3px;
  background: var(--view-toggle-bg);
  border: var(--view-toggle-border);
  border-radius: 8px;
}

.calendar-theme .view-btn {
  border: none;
  background: transparent;
  color: var(--view-btn-color);
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.15s ease;
}

.calendar-theme .view-btn.active {
  background: var(--view-btn-active-bg);
  color: var(--view-btn-active-color);
}

.calendar-theme .month-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: var(--month-cell-border);
}

.calendar-theme .month-weekday {
  text-align: center;
  padding: 8px 0;
  font-weight: bold;
  font-size: var(--month-weekday-size);
  color: var(--month-weekday-color);
}

.calendar-theme .month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(var(--month-cell-min-height), 1fr);
}

.calendar-theme .month-cell {
  border-left: var(--month-cell-border);
  border-bottom: var(--month-cell-border);
  padding: 4px;
  min-height: var(--month-cell-min-height);
  display: flex;
  flex-direction: column;
  gap: 3px;
  overflow: hidden;
}

.calendar-theme .month-cell:nth-child(7n + 1) {
  border-left: none;
}

.calendar-theme .month-cell.is-outside {
  opacity: var(--month-outside-opacity);
}

.calendar-theme .month-cell.is-today {
  background: var(--month-today-bg);
}

.calendar-theme .month-cell.drop-target {
  outline: var(--month-drop-target-outline);
  outline-offset: -2px;
}

.calendar-theme .month-daynum {
  align-self: flex-start;
  background: transparent;
  border: none;
  color: var(--month-daynum-color);
  font-size: var(--month-daynum-size);
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 999px;
  line-height: 1;
}

.calendar-theme .month-cell.is-today .month-daynum {
  background: var(--month-today-daynum-bg);
  color: var(--month-today-daynum-color);
}

.calendar-theme .month-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
}

.calendar-theme .month-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: var(--month-chip-radius);
  padding: 1px 5px;
  font-size: var(--month-chip-size);
  color: var(--month-chip-color);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
}

.calendar-theme .month-chip-time {
  font-weight: 700;
  flex-shrink: 0;
}

.calendar-theme .month-chip-title {
  overflow: hidden;
  text-overflow: ellipsis;
}

.calendar-theme .month-more {
  border: none;
  background: transparent;
  color: var(--month-daynum-color);
  font-size: var(--month-chip-size);
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  padding: 1px 5px;
  opacity: 0.75;
}

.calendar-theme .month-more:hover {
  opacity: 1;
}

/* .info-button removed – clicking anywhere on the event opens the popup */

.calendar-theme .remove-button {
  background-color: var(--danger-bg);
  color: var(--danger-text);
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 1rem;
  transition: filter 0.15s ease;
}

.calendar-theme .remove-button:hover {
  filter: brightness(0.9);
}

/* ── Today button ──────────────────────────────────────────────────────────── */
.calendar-theme .today-btn {
  background: var(--today-btn-bg, transparent);
  color: var(--today-btn-color, var(--accent-color));
  border: 1px solid var(--today-btn-border, var(--accent-color));
  padding: 0.3rem 0.75rem;
  border-radius: var(--button-border-radius, 6px);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
  margin-right: 0.5rem;
}

.calendar-theme .today-btn:hover {
  background: var(--today-btn-hover-bg, var(--accent-color));
  color: var(--today-btn-hover-color, var(--accent-contrast));
}

/* ── Current time indicator ────────────────────────────────────────────────── */
.calendar-theme .current-time-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--current-time-color, #e53e3e);
  z-index: 3;
  pointer-events: none;
}

.calendar-theme .current-time-dot {
  position: absolute;
  left: -4px;
  top: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--current-time-color, #e53e3e);
}

/* ── All-day spacer (hours column, aligns with allday-row) ─────────────────── */
.calendar-theme .allday-spacer {
  min-height: 28px;
  flex-shrink: 0;
}

/* ── All-day row ───────────────────────────────────────────────────────────── */
.calendar-theme .allday-row {
  display: flex;
  border-bottom: 1px solid var(--grid-border-color);
  min-height: 28px;
}

.calendar-theme .allday-day {
  flex: 1;
  border-left: 1px solid var(--grid-border-color);
  padding: 2px 3px;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  min-height: 24px;
}

.calendar-theme .allday-day:first-child {
  border-left: none;
}

.calendar-theme .allday-chip {
  border: none;
  border-radius: var(--month-chip-radius, 4px);
  padding: 1px 6px;
  font-size: var(--month-chip-size, 0.6875rem);
  color: var(--month-chip-color, #000);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  background: var(--calendar-primary-color);
  transition: opacity 0.15s;
}

.calendar-theme .allday-chip:hover {
  opacity: 0.8;
}

/* ── Full-width form field (title) ─────────────────────────────────────────── */
.calendar-theme .form-group--full {
  flex-basis: 100%;
}

/* ── Mobile: horizontal scroll for week view ───────────────────────────────── */
.calendar-theme .week-scroll-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.calendar-theme .hours-and-days {
  min-width: 560px;
}

@media (max-width: 768px) {
  .calendar-theme .form-container {
    flex-direction: column;
  }

  .calendar-theme .form-group {
    min-width: 100%;
  }

  .calendar-theme .weekday span:first-child {
    font-size: 0.75rem;
  }

  .calendar-theme .event {
    font-size: 10px;
  }

  .calendar-theme .event span {
    font-size: 12px !important;
  }
}
</style>