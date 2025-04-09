import { render, screen, waitFor } from '@testing-library/react';
import TrainDetailsPage from '@/app/train/[uid]/page';
import { fetchTrainDetails } from '@/services/stationService';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useParams: () => ({ uid: 'test-uid' })
}));

// Mock the stationService
jest.mock('@/services/stationService', () => ({
  fetchTrainDetails: jest.fn()
}));

const mockTrainDetails = {
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
    },
    {
      tiploc: 'TEST2',
      description: 'Test Station 2',
      workingTime: '1000',
      publicTime: '10:00',
      platform: '2',
      gbttBookedArrival: '1000',
      gbttBookedDeparture: '1005',
      realtimeArrival: '1000',
      realtimeDeparture: '1005',
      realtimeArrivalActual: false,
      realtimeDepartureActual: false
    }
  ]
};

describe('TrainDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (fetchTrainDetails as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<TrainDetailsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays train details when loaded', async () => {
    (fetchTrainDetails as jest.Mock).mockResolvedValue(mockTrainDetails);
    render(<TrainDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Station 1')).toBeInTheDocument();
      expect(screen.getByText('Test Station 2')).toBeInTheDocument();
      expect(screen.getByText('09:00')).toBeInTheDocument();
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    const errorMessage = 'Failed to fetch train details';
    (fetchTrainDetails as jest.Mock).mockRejectedValue(new Error(errorMessage));
    render(<TrainDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays correct status indicators', async () => {
    (fetchTrainDetails as jest.Mock).mockResolvedValue(mockTrainDetails);
    render(<TrainDetailsPage />);

    await waitFor(() => {
      // First station should show as passed
      const firstDot = screen.getByTestId('status-dot-0');
      expect(firstDot).toHaveClass('bg-green-500');

      // Second station should show as en route
      const secondDot = screen.getByTestId('status-dot-1');
      expect(secondDot).toHaveClass('border-2', 'border-green-500');
    });
  });
}); 