import { GET } from '@/app/api/train/[uid]/route';
import { NextRequest } from 'next/server';
import axios from 'axios';

// Mock the environment variables
process.env.RTT_USERNAME = 'test-username';
process.env.RTT_PASSWORD = 'test-password';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the isAxiosError function
jest.spyOn(axios, 'isAxiosError').mockImplementation((error: any) => {
  return error && error.isAxiosError === true;
});

// Helper function to create Axios errors
const createAxiosError = (status: number, message: string) => {
  const error = new Error(message) as any;
  error.isAxiosError = true;
  error.response = { status, data: { message } };
  return error;
};

// Helper function to create network errors
const createNetworkError = () => {
  const error = new Error('Network Error') as any;
  error.isAxiosError = true;
  error.code = 'ERR_NETWORK';
  return error;
};

describe('Train API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns mock data when credentials are missing', async () => {
    process.env.RTT_USERNAME = '';
    process.env.RTT_PASSWORD = '';

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: Promise.resolve({ uid: 'test-uid' }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.serviceUid).toBe('test-uid');
    expect(data.stops).toHaveLength(3);
    expect(data.stops[0].description).toBe('London Waterloo');
  });

  it('returns 404 when train service is not found', async () => {
    // Ensure credentials are set for this test
    process.env.RTT_USERNAME = 'test-username';
    process.env.RTT_PASSWORD = 'test-password';
    
    // Create a proper Axios error object
    const axiosError = new Error('Service not found') as any;
    axiosError.isAxiosError = true;
    axiosError.response = { 
      status: 404,
      data: { message: 'Service not found' }
    };
    
    mockedAxios.get.mockRejectedValueOnce(axiosError);

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: Promise.resolve({ uid: 'test-uid' }) });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('API error: 404 - Service not found');
  });

  it('returns train details when service is found', async () => {
    // Ensure credentials are set for this test
    process.env.RTT_USERNAME = 'test-username';
    process.env.RTT_PASSWORD = 'test-password';
    
    const mockResponse = {
      data: {
        locations: [
          {
            tiploc: 'TEST1',
            description: 'Test Station 1',
            workingTime: '0900',
            publicTime: '09:00',
            platform: '1',
            gbttBookedArrival: '0900',
            gbttBookedDeparture: '0905',
            realtimeArrival: '0900',
            realtimeDeparture: '0905',
            realtimeArrivalActual: true,
            realtimeDepartureActual: true
          }
        ]
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: Promise.resolve({ uid: 'test-uid' }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.serviceUid).toBe('test-uid');
    expect(data.stops).toHaveLength(1);
    expect(data.stops[0].description).toBe('Test Station 1');
  });

  it('handles network errors gracefully', async () => {
    // Ensure credentials are set for this test
    process.env.RTT_USERNAME = 'test-username';
    process.env.RTT_PASSWORD = 'test-password';
    
    // Create a proper Axios error object for network error
    const axiosError = new Error('Network Error') as any;
    axiosError.isAxiosError = true;
    axiosError.code = 'ERR_NETWORK';
    
    mockedAxios.get.mockRejectedValueOnce(axiosError);

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: Promise.resolve({ uid: 'test-uid' }) });

    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.error).toBe('Network error: Unable to connect to the train data service.');
  });

  it('handles general API errors gracefully', async () => {
    // Ensure credentials are set for this test
    process.env.RTT_USERNAME = 'test-username';
    process.env.RTT_PASSWORD = 'test-password';
    
    // For general errors, we don't need to create an Axios error
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: Promise.resolve({ uid: 'test-uid' }) });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch train details. Please try again later.');
  });
}); 