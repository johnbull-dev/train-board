'use client'
import React, { useState, useRef, useEffect } from 'react';
import { fetchStationData, fetchSuggestedStations } from '../services/stationService';
import { StationData, Service } from '../types/StationData';
import { StationSuggestion } from '../types/StationSuggestion';

const StationSearch = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedStations, setSuggestedStations] = useState<StationSuggestion[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (!selectedStation.trim()) {
      setError('Please select a station');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchStationData(selectedStation);
      setStationData(data);
      setSuggestedStations([]);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error fetching station data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch station data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change and fetch suggestions
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setSelectedStation(''); // Clear selected station when input changes
    
    if (value.trim().length >= 2) {
      setIsFetchingSuggestions(true);
      setIsDropdownOpen(true);
      try {
        const suggestions = await fetchSuggestedStations(value);
        setSuggestedStations(suggestions);
        
        // Only keep dropdown open if we have suggestions
        if (suggestions.length === 0) {
          setIsDropdownOpen(false);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestedStations([]);
        setIsDropdownOpen(false);
      } finally {
        setIsFetchingSuggestions(false);
      }
    } else {
      setSuggestedStations([]);
      setIsDropdownOpen(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: StationSuggestion) => {
    setSearchInput(`${suggestion.name} (${suggestion.code})`);
    setSelectedStation(suggestion.code);
    setIsDropdownOpen(false);
    
    // Optionally trigger search immediately
    fetchStationData(suggestion.code)
      .then(data => {
        setStationData(data);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching station data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch station data. Please try again.');
      });
  };

  // Handle input focus
  const handleInputFocus = () => {
    // Only show dropdown if we have at least 2 characters and either have suggestions
    // or are currently fetching them
    if (searchInput.trim().length >= 2 && 
        (suggestedStations.length > 0 || isFetchingSuggestions)) {
      setIsDropdownOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 bg-gray-50">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Train Bored - Train Times</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-grow">
            <div className="relative">
              <label htmlFor="station-input" className="sr-only">Enter station name or code</label>
              <input
                ref={inputRef}
                id="station-input"
                type="text"
                placeholder="Enter station name or code (e.g. Bournemouth or BMH)"
                value={searchInput}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                className="text-black px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              />
              
              {isFetchingSuggestions && (
                <div className="absolute right-3 top-2">
                  <div className="animate-spin h-5 w-5 border-2 border-green-500 rounded-full border-t-transparent"></div>
                </div>
              )}
              
              {isDropdownOpen && (
                <div 
                  ref={dropdownRef}
                  id="station-suggestions"
                  className="absolute z-10 w-full mt-0 bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg max-h-60 overflow-auto"
                  role="listbox"
                >
                  {suggestedStations.length > 0 ? (
                    <ul className="py-1">
                      {suggestedStations.map((suggestion, index) => (
                        <li 
                          key={index}
                          className="px-3 py-2 text-black hover:bg-green-50 cursor-pointer text-sm"
                          onClick={() => handleSelectSuggestion(suggestion)}
                          role="option"
                          aria-selected={selectedStation === suggestion.code}
                        >
                          <span className="font-medium">{suggestion.name}</span> 
                          <span className="text-gray-500 ml-2">({suggestion.code})</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      No stations found matching your search
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
        <p id="station-hint" className="text-xs sm:text-sm text-gray-600">Enter a station name or code (e.g. Bournemouth or BMH)</p>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 my-3 sm:my-4" role="alert">
            <p className="text-sm sm:text-base">{error}</p>
          </div>
        )}
      </div>

      {stationData && stationData.location && (
        <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2" id="station-name">{stationData.location.name}</h2>
      )}
      {stationData && stationData.services && stationData.services.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 overflow-hidden">
          
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Services</h3>
          
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <caption className="sr-only">Train services at {stationData.location.name}</caption>
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                    Provider
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white tracking-wider">
                    Destination
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white tracking-wider">
                    <span className="hidden sm:inline">Platform</span><span className="inline sm:hidden">Plat</span>
                  </th>
                  <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                    Origin
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-white tracking-wider">
                    <span className="hidden sm:inline">Departure Time</span><span className="inline sm:hidden">Dep</span>
                  </th>
                  <th scope="col" className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                    <span className="hidden sm:inline">Arrival Time</span><span className="inline sm:hidden">Arr</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stationData.services.map((service: Service, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {service.atocName}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                      {service.locationDetail.destination[0].description}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                      {service.locationDetail.platform}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {service.locationDetail.origin[0].description}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                      {service.locationDetail.realtimeDeparture
                        ? `${service.locationDetail.realtimeDeparture.slice(0, 2)}:${service.locationDetail.realtimeDeparture.slice(2, 4)}`
                        : ''}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {service.locationDetail.destination[0].publicTime 
                        ? `${service.locationDetail.destination[0].publicTime.slice(0, 2)}:${service.locationDetail.destination[0].publicTime.slice(2, 4)}`
                        : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {stationData && (stationData.services === null || stationData.services === undefined || stationData.services.length === 0) && (
        <p className="text-gray-700 italic py-3 sm:py-4 text-sm sm:text-base">No services available for this station.</p>
      )}
      
      {!stationData && !isLoading && !error && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-center">
          <p className="text-gray-700 text-sm sm:text-base">Enter a station name or code and click Search to view train information.</p>
        </div>
      )}
    </div>
  );
};  

export default StationSearch; 