'use client'
import React, { useState } from 'react';
import { fetchStationData } from '../services/stationService';
import { StationData, Service } from '../services/StationData';
const StationSearch = () => {
  const [station, setStation] = useState('');
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!station.trim()) {
      setError('Please enter a station code');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchStationData(station);
      setStationData(data);
    } catch (error) {
      console.error('Error fetching station data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch station data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Train Station Information</h1>
        
        {/* Search form */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <label htmlFor="station-input" className="sr-only">Enter station code</label>
          <input
            id="station-input"
            type="text"
            placeholder="Enter station code (e.g. BMH)"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 flex-grow"
            aria-describedby="station-hint"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200 disabled:opacity-70"
            aria-busy={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <p id="station-hint" className="text-sm text-gray-600">Enter a valid UK station code (e.g. BMH for Bournemouth)</p>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Station data display */}
      {stationData && stationData.location && (
        <h2 className="text-2xl font-bold text-green-600 mb-2" id="station-name">{stationData.location.name}</h2>
      )}
      {stationData && stationData.services && stationData.services.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
          <div className="mb-6">
            <div className="inline-block bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium">
              {stationData.location.crs}
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Services</h3>
          
          <div className="overflow-x-auto">
            {stationData.services && stationData.services.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">Train services at {stationData.location.name}</caption>
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Provider
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Destination
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Origin
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Departure Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Arrival Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stationData.services && stationData.services.map((service: Service, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.atocName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {service.locationDetail.destination[0].description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {service.locationDetail.origin[0].description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {service.locationDetail.origin[0].publicTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {service.locationDetail.destination[0].publicTime}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>)}
          </div>
          </div>
      )}
          {stationData && (stationData.services === null || stationData.services.length === 0) && (
            <p className="text-gray-700 italic py-4">No services available for this station.</p>
          )}
        
      
      {!stationData && !isLoading && !error && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-700">Enter a station code and click Search to view train information.</p>
        </div>
      )}
    </div>
  );
};  

export default StationSearch; 