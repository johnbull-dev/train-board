'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchTrainDetails, TrainDetails } from '@/services/stationService';
import { TrainLocation } from '@/types/TrainLocation';
import Link from 'next/link';

// Helper function to format time from HHMM to HH:MM
const formatTime = (time: string | undefined): string => {
  if (!time) return '-';
  // Ensure the time string is 4 digits by padding with leading zeros
  const paddedTime = time.padStart(4, '0');
  return `${paddedTime.slice(0, 2)}:${paddedTime.slice(2, 4)}`;
};

// Helper function to determine train status
const getTrainStatus = (stop: TrainLocation, index: number, stops: TrainLocation[]): string => {
  console.log('Checking status for stop:', stop.description, {
    realtimeArrivalActual: stop.realtimeArrivalActual,
    realtimeDepartureActual: stop.realtimeDepartureActual,
    realtimeArrival: stop.realtimeArrival,
    realtimeDeparture: stop.realtimeDeparture
  });

  // If the train has both arrived and departed
  if (stop.realtimeArrivalActual === true && stop.realtimeDepartureActual === true) {
    return 'Passed';
  }
  
  // If the train has arrived but not departed
  if (stop.realtimeArrivalActual === true && stop.realtimeDepartureActual !== true) {
    return 'At Station';
  }
  
  // If the train hasn't arrived yet
  if (stop.realtimeArrivalActual !== true) {
    // Check if we've passed any stations
    const hasPassedAnyStation = stops.some(s => s.realtimeArrivalActual === true);
    if (hasPassedAnyStation) {
      return 'En Route';
    }
  }
  
  return '';
};

export default function TrainDetailsPage() {
  const params = useParams();
  const [trainDetails, setTrainDetails] = useState<TrainDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrainDetails = async () => {
      try {
        const details = await fetchTrainDetails(params.uid as string);
        setTrainDetails(details);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load train details');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainDetails();
  }, [params.uid]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!trainDetails) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-700">No train details found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/"
          className="text-green-600 hover:text-green-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Station Search
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Train Service Details</h1>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                  Station
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                  Arrival
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider">
                  Departure
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trainDetails.stops.map((stop, index) => {
                const status = getTrainStatus(stop, index, trainDetails.stops);
                console.log('Status for', stop.description, ':', status);
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {status === 'Passed' && (
                        <span className="text-gray-500 text-lg">✓</span>
                      )}
                      {status === 'At Station' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          At Station
                        </span>
                      )}
                      {status === 'En Route' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          En Route
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stop.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stop.platform || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(stop.realtimeArrival || stop.gbttBookedArrival)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(stop.realtimeDeparture || stop.gbttBookedDeparture)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 