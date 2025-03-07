
/**
 * Represents data for a train station
 * @interface StationData
 * @property {LocationInfo} location - Information about the station's location
 * @property {null} filter - Filter information (currently null)
 * @property {Service[]} services - Array of services at this station
 */
export interface StationData {
    location: LocationInfo;
    filter: null;        // or a different type if it's sometimes not null
    services: Service[];
  }

  /**
   * Represents information about a station's location
   * @interface LocationInfo
   * @property {string} name - The name of the station
   * @property {string} crs - Computer Reservation System code
   * @property {string} tiploc - Timing Point Location code
   * @property {string} country - Country where the station is located
   * @property {string} system - System identifier
   */
  export interface LocationInfo {
    name: string;
    crs: string;
    tiploc: string;
    country: string;
    system: string;
  }

  /**
   * Represents a train service
   * @interface Service
   * @property {LocationDetail} locationDetail - Detailed location information
   * @property {string} serviceUid - Unique identifier for the service
   * @property {string} runDate - Date the service runs
   * @property {string} trainIdentity - Train identity code
   * @property {string} runningIdentity - Running identity code
   * @property {string} atocCode - ATOC company code
   * @property {string} atocName - ATOC company name
   * @property {string} serviceType - Type of service
   * @property {boolean} isPassenger - Whether this is a passenger service
   */
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

  /**
   * Represents detailed location information for a train service
   * @interface LocationDetail
   * @property {boolean} realtimeActivated - Whether real-time data is activated
   * @property {string} tiploc - Timing Point Location code
   * @property {string} crs - Computer Reservation System code
   * @property {string} description - Description of the location
   * @property {string} gbttBookedArrival - GBTT booked arrival time
   * @property {string} gbttBookedDeparture - GBTT booked departure time
   * @property {LegLocation[]} origin - Origin leg locations
   * @property {LegLocation[]} destination - Destination leg locations
   * @property {boolean} isCall - Whether this is a call
   * @property {boolean} isPublicCall - Whether this is a public call
   * @property {string} realtimeArrival - Real-time arrival time
   * @property {boolean} realtimeArrivalActual - Whether the real-time arrival is actual
   * @property {string} realtimeDeparture - Real-time departure time
   * @property {boolean} realtimeDepartureActual - Whether the real-time departure is actual
   * @property {string} platform - Platform number
   * @property {boolean} platformConfirmed - Whether the platform is confirmed
   * @property {boolean} platformChanged - Whether the platform has changed
   * @property {string} displayAs - Whether this is an origin or destination
   * @property {Association[]} associations - Associations for this service
   */
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

  /**
   * Represents a leg location in a train service
   * @interface LegLocation
   * @property {string} tiploc - Timing Point Location code
   * @property {string} description - Description of the location
   * @property {string} workingTime - Working time for this location
   * @property {string} publicTime - Public time for this location
   */
  export interface LegLocation {
    tiploc: string;
    description: string;
    workingTime: string;  // e.g. "124500"
    publicTime: string;   // e.g. "1245"
  }

  /**
   * Represents an association between services
   * @interface Association
   * @property {string} type - Type of association (either "divide" or "join")
   * @property {string} associatedUid - Unique identifier for the associated service
   * @property {string} associatedRunDate - Date the associated service runs
   */
  export interface Association {
    type: "divide" | "join";
    associatedUid: string;    // e.g. "Y15820"
    associatedRunDate: string; // e.g. "2025-03-05"
  }
    
  /**
   * Error response type
   * @type ErrorResponse
   * @property {string} error - Error message describing what went wrong
   */
  export type ErrorResponse = {
    error: string;
  };