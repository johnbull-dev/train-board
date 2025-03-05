import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { StationData } from '@/services/stationService';

// Mock data for development and testing
const mockStationData: StationData = {
  location: {
    name: "Bournemouth",
    crs: "BMH",
    tiploc: "BOURNMTH",
    country: "England",
    system: "National Rail"
  },
  filter: null,
  services: [
    {
      serviceID: "SWR123",
      operator: "SWR",
      operatorCode: "SW",
      operatorName: "South Western Railway",
      operatorType: "TOC"
    },
    {
      serviceID: "GWR456",
      operator: "GWR",
      operatorCode: "GW",
      operatorName: "Great Western Railway",
      operatorType: "TOC"
    }
  ]
};

export async function GET(
  request: NextRequest,
  context: { params: { code: string } }
) {
  // In Next.js 15, we need to await the params
  const params = await Promise.resolve(context.params);
  const stationCode = params.code;
  
  // For testing purposes, you can enable this to always return mock data
  const useMockData = process.env.USE_MOCK_DATA === 'true';
  
  if (useMockData) {
    console.log('Using mock data for station:', stationCode);
    return NextResponse.json({
      ...mockStationData,
      location: {
        ...mockStationData.location,
        crs: stationCode.toUpperCase()
      }
    });
  }

  try {
    // Server-side environment variables (not exposed to the client)
    const username = process.env.RTT_USERNAME;
    const password = process.env.RTT_PASSWORD;

    if (!username || !password) {
      console.warn('API credentials not found. Using mock data instead.');
      return NextResponse.json({
        ...mockStationData,
        location: {
          ...mockStationData.location,
          crs: stationCode.toUpperCase()
        }
      });
    }

    const response = await axios.get(`https://api.rtt.io/api/v1/json/search/${stationCode}`, {
      auth: {
        username,
        password
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching station data:', error);
    
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ERR_NETWORK') {
        return NextResponse.json(
          { error: 'Network error: Unable to connect to the train data service.' },
          { status: 503 }
        );
      } else if (error.response) {
        return NextResponse.json(
          { 
            error: `API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}` 
          },
          { status: error.response.status }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch station data. Please try again later.' },
      { status: 500 }
    );
  }
} 