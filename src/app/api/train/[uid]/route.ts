import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { TrainLocation } from '@/types/TrainLocation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const resolvedParams = await Promise.resolve(params);
  const serviceUid = resolvedParams.uid;
  console.log('Fetching train details for service UID:', serviceUid);

  if (!serviceUid) {
    return NextResponse.json(
      { error: 'Service UID is required' },
      { status: 400 }
    );
  }

  try {
    const username = process.env.RTT_USERNAME;
    const password = process.env.RTT_PASSWORD;

    if (!username || !password) {
      console.warn('API credentials not found. Using mock data instead.');
      return NextResponse.json({
        serviceUid,
        stops: [
          {
            tiploc: "WATRLOO",
            description: "London Waterloo",
            workingTime: "103000",
            publicTime: "1030",
            platform: "1"
          },
          {
            tiploc: "BOURNMTH",
            description: "Bournemouth",
            workingTime: "114500",
            publicTime: "1145",
            platform: "2"
          },
          {
            tiploc: "WEYMTH",
            description: "Weymouth",
            workingTime: "123000",
            publicTime: "1230",
            platform: "1"
          }
        ]
      });
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    console.log('Making request to RTT API for service:', serviceUid);
    const response = await axios.get(`https://api.rtt.io/api/v1/json/service/${serviceUid}/${year}/${month}/${day}`, {
      auth: {
        username,
        password
      }
    });

    console.log('Received response from RTT API');
    
    if (!response.data || !response.data.locations) {
      console.error('Invalid response format from RTT API:', response.data);
      return NextResponse.json(
        { error: 'Invalid response format from train data service' },
        { status: 500 }
      );
    }

    // Transform the response to include only the stops we need
    const stops = response.data.locations.map((location: TrainLocation) => ({
      tiploc: location.tiploc,
      description: location.description,
      workingTime: location.workingTime,
      publicTime: location.publicTime,
      platform: location.platform,
      gbttBookedArrival: location.gbttBookedArrival,
      gbttBookedDeparture: location.gbttBookedDeparture,
      realtimeArrival: location.realtimeArrival,
      realtimeDeparture: location.realtimeDeparture,
      realtimeArrivalActual: location.realtimeArrivalActual,
      realtimeDepartureActual: location.realtimeDepartureActual
    }));

    return NextResponse.json({
      serviceUid,
      stops
    });
  } catch (error) {
    console.error('Error fetching train details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

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
      { error: 'Failed to fetch train details. Please try again later.' },
      { status: 500 }
    );
  }
} 