import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { fetchStationData, fetchSuggestedStations } from '../../src/services/stationService';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('StationService station data ', () => {
    // Mock data that matches the StationData interface
    const mockStationData = {
        location: {
            name: 'Bletchley',
            crs: 'BLY',
            tiploc: 'BLTCHLY',
            country: 'England',
            system: 'National Rail'
        },
        filter: null,
        services: []
    };

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Setup the axios.get mock to return our mock data
        jest.spyOn(axios, 'get').mockResolvedValue({
            data: mockStationData
        });
    });

    it('should return the correct station data', async () => {
        const stationData = await fetchStationData('BLY');
        
        // Verify axios was called with the correct URL
        expect(axios.get).toHaveBeenCalledWith('/api/station/BLY');
        
        // Verify the returned data
        expect(stationData).toBeDefined();
        expect(stationData.location.name).toBe('Bletchley');
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle errors correctly', async () => {
        // Setup axios to simulate an error
        const errorMessage = 'Failed to fetch station data. Please try again.';
        jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error(errorMessage));
        
        // Expect the fetchStationData function to throw an error
        await expect(fetchStationData('BLY')).rejects.toThrow(errorMessage);
        expect(axios.get).toHaveBeenCalledWith('/api/station/BLY');
        expect(axios.get).toHaveBeenCalledTimes(1);

    });
});

describe('StationService suggested stations', () => {
    const mockStationData = [{
        location: {
            name: 'Bletchley',
            crs: 'BLY',
            tiploc: 'BLTCHLY',
            country: 'England',
            system: 'National Rail'
        },
        filter: null,
        services: []
    }];


    
    it('should return suggested stations', async () => {
        jest.clearAllMocks();
        jest.spyOn(axios, 'get').mockResolvedValue({
            data: mockStationData,
            status: 200
        });
        const suggestedStations = await fetchSuggestedStations('BLY');
        expect(suggestedStations).toBeDefined();
         expect(suggestedStations.length).toBeGreaterThan(0);
    });

    it('should return an empty array if no suggestions are found', async () => {
        // Setup mock to return empty array
        jest.clearAllMocks();
        jest.spyOn(axios, 'get').mockResolvedValue({
            data: [],
            status: 200
        });
        
        const suggestedStations = await fetchSuggestedStations('BLY');
        expect(suggestedStations).toBeDefined();
        expect(suggestedStations.length).toBe(0);
        expect(axios.get).toHaveBeenCalledWith('/api/suggestions/BLY');
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle errors correctly', async () => {
        jest.clearAllMocks();
        jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('Failed to fetch suggestions'));
        
        const result = await fetchSuggestedStations('BLY');
        expect(result).toEqual([]);
        expect(axios.get).toHaveBeenCalledWith('/api/suggestions/BLY');
        expect(axios.get).toHaveBeenCalledTimes(1);
    });
});
