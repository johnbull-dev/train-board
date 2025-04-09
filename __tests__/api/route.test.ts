import { GET } from '@/app/api/train/[uid]/route';
import { NextRequest } from 'next/server';
import axios from 'axios';

// Mock the environment variables
process.env.RTT_USERNAME = 'test-username';
process.env.RTT_PASSWORD = 'test-password';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Train API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns mock data when credentials are missing', async () => {
    process.env.RTT_USERNAME = '';
    process.env.RTT_PASSWORD = '';

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: { uid: 'test-uid' } });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.serviceUid).toBe('test-uid');
    expect(data.stops).toHaveLength(3);
    expect(data.stops[0].description).toBe('London Waterloo');
  });

  it('returns 404 when train service is not found', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: { 
        status: 404,
        data: { message: 'Service not found' }
      }
    });

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: { uid: 'test-uid' } });

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('API error: 404 - Service not found');
  });

  it('returns train details when service is found', async () => {
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
    const response = await GET(request, { params: { uid: 'test-uid' } });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.serviceUid).toBe('test-uid');
    expect(data.stops).toHaveLength(1);
    expect(data.stops[0].description).toBe('Test Station 1');
  });

  it('handles network errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      isAxiosError: true,
      code: 'ERR_NETWORK',
      message: 'Network Error',
      status: 503
    });

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: { uid: 'test-uid' } });

    expect(response.status).toBe(503);
    const data = await response.json();
    expect(data.error).toBe('Network error: Unable to connect to the train data service.');
  });

  it('handles general API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    const request = new NextRequest('http://localhost:3000/api/train/test-uid');
    const response = await GET(request, { params: { uid: 'test-uid' } });

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch train details. Please try again later.');
  });
}); 