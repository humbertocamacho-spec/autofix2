export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    status: string;
    notes?: string;
    partnerName?: string;
    userDisabled: boolean;
  };
};