export interface StationData {
    location: LocationInfo;
    filter: null;        // or a different type if it's sometimes not null
    services: Service[];
  }
  
  export interface LocationInfo {
    name: string;
    crs: string;
    tiploc: string;
    country: string;
    system: string;
  }
  
  export interface Service {
    locationDetail: LocationDetail;
    serviceUid: string;      // e.g. "P11704"
    runDate: string;         // e.g. "2025-03-05"
    trainIdentity: string;   // e.g. "1M50"
    runningIdentity: string; // e.g. "1M50"
    atocCode: string;        // e.g. "XC"
    atocName: string;        // e.g. "CrossCountry"
    serviceType: string;     // e.g. "train"
    isPassenger: boolean;
  }
  
  export interface LocationDetail {
    realtimeActivated: boolean;
    tiploc: string;           // e.g. "BOMO"
    crs: string;              // e.g. "BMH"
    description: string;      // e.g. "Bournemouth"
  
    // These can appear in some services but not others, so mark them optional:
    gbttBookedArrival?: string;   // e.g. "1254"
    gbttBookedDeparture?: string; // e.g. "1245"
  
    origin: LegLocation[];
    destination: LegLocation[];
  
    isCall: boolean;         // e.g. true
    isPublicCall: boolean;   // e.g. true
  
    // Real-time fields
    realtimeArrival?: string;         // e.g. "1253"
    realtimeArrivalActual?: boolean;  // e.g. false
    realtimeDeparture?: string;       // e.g. "1259"
    realtimeDepartureActual?: boolean;// e.g. false
  
    platform?: string;               // e.g. "2"
    platformConfirmed?: boolean;     // e.g. false
    platformChanged?: boolean;       // e.g. false
  
    displayAs: string;               // e.g. "ORIGIN" or "CALL"
    associations?: Association[];    // Some services have association details; optional if not present
  }
  
  export interface LegLocation {
    tiploc: string;
    description: string;
    workingTime: string;  // e.g. "124500"
    publicTime: string;   // e.g. "1245"
  }
  
  export interface Association {
    type: "divide" | "join";
    associatedUid: string;    // e.g. "Y15820"
    associatedRunDate: string; // e.g. "2025-03-05"
  }
  
  
  /**
   * Error response type
   */
  export type ErrorResponse = {
    error: string;
  };