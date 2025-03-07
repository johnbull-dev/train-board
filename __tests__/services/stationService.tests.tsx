import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { fetchStationData } from '../../src/services/stationService';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('StationService', () => {
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

    afterEach(() => {
        // Clean up after each test
        jest.resetAllMocks();
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
        const errorMessage = 'Network Error';
        jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error(errorMessage));
        
        // Expect the fetchStationData function to throw an error
        await expect(fetchStationData('BLY')).rejects.toThrow();
        expect(axios.get).toHaveBeenCalledWith('/api/station/BLY');
        expect(axios.get).toHaveBeenCalledTimes(1);

    });
});
