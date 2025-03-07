import axios from 'axios';
import { ErrorResponse, StationData } from '../types/StationData';

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
    console.error('Error fetching station data:', error);
    
    // Extract error message from the response if available
    let errorMessage = 'Failed to fetch station data. Please try again.';
    
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data as ErrorResponse;
      errorMessage = errorData.error || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
}