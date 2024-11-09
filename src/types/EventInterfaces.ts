// src/types/EventInterfaces.ts

export interface FieldOption {
    id: string;
    name?: string;
    first_name?: string;
    last_name?: string;
  }
  
  export interface Field {
    id: string;
    label: string;
    type: string;
    model: string;
    options?: FieldOption[];
  }
  
  export interface EventInfo {
    title: string;
    color?: string;
    teacher: string;
    start: string;
    end: string;
    date: string;
    id?: number | string;
    info?: string;
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