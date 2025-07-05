// src/types/EventInterfaces.ts

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
  }
  
  export interface PopupProps {
    visible: boolean;
    closeButtonText: string;
    eventData?: { [key: string]: any };
    popupFields: string[];
  }

  export interface EventInfo {
  id: number;
  title: string;
  start: string;
  end: string;
  date: string;
  color?: string;
  info?: string;
  teacher?: string;
  room?: string;
  [key: string]: any;
}
