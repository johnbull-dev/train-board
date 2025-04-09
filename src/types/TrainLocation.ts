export interface TrainLocation {
  tiploc: string;
  crs: string;
  description: string;
  workingTime: string;
  publicTime: string;
  platform?: string;
  gbttBookedArrival?: string;
  gbttBookedDeparture?: string;
  realtimeArrival?: string;
  realtimeDeparture?: string;
  realtimeArrivalActual?: boolean;
  realtimeDepartureActual?: boolean;
  displayAs: 'ORIGIN' | 'CALL' | 'DESTINATION';
  isCall: boolean;
  isPublicCall: boolean;
  line?: string;
  lineConfirmed?: boolean;
  path?: string;
  pathConfirmed?: boolean;
  platformConfirmed?: boolean;
  platformChanged?: boolean;
  realtimeActivated: boolean;
  realtimeGbttArrivalLateness?: number;
  realtimeGbttDepartureLateness?: number;
  serviceLocation?: string;
} 