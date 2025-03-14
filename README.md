# Train Bored

I've found that it's hard to find a simple app to show train times for a specific station. I've been travelling on trains for the last 25 years, and I've used websites like National Rail Enquiries and Trainline to find train times, but now they want to know the origin and destination of the train to sell you a ticket. As an experienced train user I just want to see all the trains departing a station so I can choose which one to get.

## Feedback
I've built this app to satisfy my own needs, but if you have any feedback or suggestions, then feel free to raise an issue so I can consider incorporating it into the app.

## Version Info

### 2025.3.6
- Changed the title to "Train Bored"
- Modified the condition for displaying the "No services available" message to include undefined return from service

### 2025.3.5
- Change the search input to be a search dropdown of suggested stations. It shows 10 suggestions at a time.
- Added a new API route to fetch 10 suggested stations based on the station code or name
- Added a new test to check the new API route

### 2025.3.4
- StationService tests now use Jest and mock axios

### 2025.3.3
- Added comprehensive test coverage with Jest and React Testing Library

# 2025.3.1
- Basic search using TIPLOC codes
- Table to show origin of train, destination, platform, arrival time at station and arrival time at final destination 
- Basic styling
- Responsive design


## Project Overview

This application showcases my implementation of a React-based frontend that interacts with the RealTime Trains API to deliver accurate train information. It demonstrates my approach to:

- Building responsive React components
- Implementing clean API service layers
- Handling errors gracefully
- Creating type-safe interfaces
- Setting up server-side API routes in Next.js

## Technical Implementation

### Architecture

The project follows a clean separation of concerns:

- **Frontend Components**: React components for user interaction
- **Service Layer**: Abstraction for API calls and data processing
- **API Routes**: Server-side endpoints that securely proxy external API requests
- **Type Definitions**: Strong typing for predictable behavior

### Key Technical Features

- **Server-side API Proxy**: Securely handles authentication with the RealTime Trains API
- **Error Handling**: Comprehensive error handling with informative user feedback
- **Mock Data Support**: Toggle between real API data and mock responses for testing
- **Station Data Integration**: Utilizes CORPUS Extract for station reference data

## Code Examples

The codebase demonstrates several best practices:

- **Type Safety**:
  ```typescript
  export type CorpusData = {
    "3ALPHA": string;
    "NLCDESC": string;
  };
  ```

- **Service Abstraction**:
  ```typescript
  export async function fetchStationData(station: string): Promise<StationData> {
    // Implementation that handles API calls and error states
  }
  ```

- **Environment Configuration**:
  ```
  RTT_USERNAME=rttapi_username
  RTT_PASSWORD=secure_password
  # USE_MOCK_DATA=true # For testing
  ```

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- pnpm package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/uk-train-station-app.git
   cd uk-train-station-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a `.env` file with your RealTime Trains API credentials.

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Development Approach

This project reflects my development philosophy:

- **Clean, readable code** with consistent formatting
- **Strong typing** to prevent runtime errors
- **Separation of concerns** for maintainability
- **Graceful error handling** for better user experience
- **Environment-based configuration** for flexibility

## Future Enhancements

Areas I plan to expand on:

- Add comprehensive test coverage with Jest and React Testing Library
- Implement caching strategies for improved performance
- Add more advanced filtering and search capabilities
- Create a responsive mobile-first design

## License

[MIT License](LICENSE)

## Contact

Feel free to reach out if you'd like to discuss this project or potential opportunities.

