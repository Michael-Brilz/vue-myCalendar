// src/types/EventInterfaces.ts

  export interface Field {
    id: string;
    label: string;
    type: string;
    model: string;
    options?: { [key: string]: any };
  }
  
  export interface EventInfo {
    [key: string]: any;
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