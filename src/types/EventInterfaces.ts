
export interface Field {
  id: string;
  label: string;
  type: string;
  model: string;
  options?: { [key: string]: any };
}

export interface LabelsAndSettings {
  startTimeLabel?: string;
  endTimeLabel?: string;
  dateLabel?: string;
  submitButtonText?: string;
  calendarWeekLabel?: string;
  todosLabel?: string;
  participantsLabel?: string;
  weekViewLabel?: string
  monthViewLabel?: string
}

export interface PopupProps {
  visible: boolean;
  closeButtonText: string;
  eventData?: { [key: string]: any };
  popupFields: string[];
}

export type EventSource = 'manual' | 'project';

export type RecurrenceRule = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface EventInfo {
  id: number;
  title: string;
  startsAt?: string
  endsAt?: string
  date?: string
  start?: string
  end?: string

  color?: string
  info?: string
  todos?: string[]
  participants?: string[]
  [key: string]: any

  allDay?: boolean;
  source?: EventSource;
  editable?: boolean;
  reminderMinutes?: number | null;
  link?: string | null;
  recurrence?: RecurrenceRule;

  description?: string;
  teacher?: string;
  room?: string;
}