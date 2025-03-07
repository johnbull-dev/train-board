import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { StationData } from '@/types/StationData';

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
      serviceUid: "SWR123",
      runDate: "2023-06-15",
      trainIdentity: "1A01",
      runningIdentity: "1A01",
      atocCode: "SW",
      atocName: "South Western Railway",
      serviceType: "train",
      isPassenger: true,
      locationDetail: {
        realtimeActivated: true,
        tiploc: "BOURNMTH",
        crs: "BMH",
        description: "Bournemouth",
        origin: [{ 
          tiploc: "WATRLOO", 
          description: "London Waterloo", 
          workingTime: "103000", 
          publicTime: "1030" 
        }],
        destination: [{ 
          tiploc: "WEYMTH", 
          description: "Weymouth", 
          workingTime: "123000", 
          publicTime: "1230" 
        }],
        isCall: true,
        isPublicCall: true,
        realtimeDeparture: "1145",
        platform: "2",
        displayAs: "CALL"
      }
    },
    {
      serviceUid: "GWR456",
      runDate: "2023-06-15",
      trainIdentity: "2B02",
      runningIdentity: "2B02",
      atocCode: "GW",
      atocName: "Great Western Railway",
      serviceType: "train",
      isPassenger: true,
      locationDetail: {
        realtimeActivated: true,
        tiploc: "BOURNMTH",
        crs: "BMH",
        description: "Bournemouth",
        origin: [{ 
          tiploc: "BRSTPKY", 
          description: "Bristol Parkway", 
          workingTime: "093000", 
          publicTime: "0930" 
        }],
        destination: [{ 
          tiploc: "SOTON", 
          description: "Southampton Central", 
          workingTime: "123000", 
          publicTime: "1230" 
        }],
        isCall: true,
        isPublicCall: true,
        realtimeDeparture: "1215",
        platform: "3",
        displayAs: "CALL"
      }
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }>}
) {
  // In Next.js 15, params can be a Promise
  const resolvedParams = await Promise.resolve(params);
  const stationCode = resolvedParams.code;
  
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