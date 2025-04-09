import { fetchStationData, fetchTrainDetails } from '@/services/stationService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Station Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchStationData', () => {
    it('returns station data when API call is successful', async () => {
      const mockResponse = {
        data: {
          services: [
            {
              serviceUid: 'test-uid',
              runDate: '2024-03-20',
              locationDetail: {
                origin: [{ description: 'Test Origin' }],
                destination: [{ description: 'Test Destination' }],
                realtimeArrival: '0900',
                realtimeDeparture: '0905'
              }
            }
          ]
        }
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await fetchStationData('TEST');
      expect(result.services).toHaveLength(1);
      expect(result.services[0].serviceUid).toBe('test-uid');
    });

    it('handles API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(fetchStationData('TEST')).rejects.toThrow('Failed to fetch station data');
    });
  });

  describe('fetchTrainDetails', () => {
    it('returns train details when API call is successful', async () => {
      const mockResponse = {
        data: {
          serviceUid: 'test-uid',
          stops: [
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

      const result = await fetchTrainDetails('test-uid');
      expect(result.serviceUid).toBe('test-uid');
      expect(result.stops).toHaveLength(1);
      expect(result.stops[0].description).toBe('Test Station 1');
    });

    it('handles API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(fetchTrainDetails('test-uid')).rejects.toThrow('Failed to fetch train details');
    });

    it('handles 404 response', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        isAxiosError: true,
        response: { 
          status: 404,
          data: { error: 'Train service not found' }
        }
      });

      await expect(fetchTrainDetails('test-uid')).rejects.toThrow('Failed to fetch train details. Please try again.');
    });
  });
}); 