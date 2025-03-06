import axios from 'axios';
import { ErrorResponse, StationData } from './StationData';



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

export async function lookupStationName(station: string): Promise<string> {
  try {
    const fs = require('fs');
    const lookup = JSON.parse(fs.readFileSync('data/CORPUSExtract.json', 'utf8'));
    
    const corpusData = lookup.TIPLOCDATA as CorpusData[];
    const stationData = corpusData.find((item: CorpusData) => item['3ALPHA'] === station);
    const stationName = stationData ? stationData['NLCDESC'] : null;
    
    if (stationName) {
      return stationName;
    } else {
      throw new Error('Station not found.');
    }
    
  } catch (error) {
    console.error('Error fetching station name:', error);
    throw new Error('Failed to fetch station name. Please try again.');
  }
}

export type CorpusData = {
  "3ALPHA": string;
  "NLCDESC": string;
};
