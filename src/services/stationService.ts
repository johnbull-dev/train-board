import axios from "axios";
import { ErrorResponse, StationData } from "../types/StationData";
import { TrainLocation } from "../types/TrainLocation";

/**
 * Fetch station data from our server-side API route
 * @param station - The station code to fetch data for
 * @returns The station data
 */
export async function fetchStationData(station: string): Promise<StationData> {
  try {
    // Call our server-side API route instead of the external API directly
    const response = await axios.get(`/api/station/${station}`);
    return response.data as StationData;
  } catch (error) {
    console.error("Error fetching station data:", error);

    // Extract error message from the response if available
    let errorMessage = "Failed to fetch station data. Please try again.";

    if (axios.isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as ErrorResponse;
      errorMessage = errorData.error || errorMessage;
    }

    throw new Error(errorMessage);
  }
}

export async function fetchSuggestedStations(
  station: string,
): Promise<{name: string, code: string}[]> {
  try {
    const response = await axios.get(`/api/suggestions/${station}`);
    
    // Check if the response is an array (successful response)
    if (Array.isArray(response.data)) {
      return response.data as {name: string, code: string}[];
    }
    
    // If it's not an array but has a status of 200, return an empty array
    if (response.status === 200) {
      console.warn('Received non-array data from suggestions API:', response.data);
      return [];
    }
    
    throw new Error('Invalid response format from suggestions API');
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    
    // Extract error message if available
    let errorMessage = "Failed to fetch suggestions";
    
    if (axios.isAxiosError(error) && error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    // For debugging purposes, log the full error
    console.error("Detailed error:", {
      status: axios.isAxiosError(error) ? error.response?.status : 'unknown',
      data: axios.isAxiosError(error) ? error.response?.data : 'unknown',
      message: error instanceof Error ? error.message : String(error)
    });
    
    // Return empty array instead of throwing to prevent UI disruption
    return [];
  }
}

export interface TrainDetails {
  serviceUid: string;
  stops: TrainLocation[];
}

export async function fetchTrainDetails(serviceUid: string): Promise<TrainDetails> {
  try {
    const response = await axios.get(`/api/train/${serviceUid}`);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    return response.data as TrainDetails;
  } catch (error) {

    let errorMessage = "Failed to fetch train details. Please try again.";

    if (axios.isAxiosError(error)) {

      if (error.response?.status === 404) {
        errorMessage = "Train service not found. The service may have ended or been cancelled.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
    }

    throw new Error(errorMessage);
  }
}
