# UK Train Station Information App

A modern web application that provides real-time information about UK train stations and services, built as a personal project to demonstrate my coding style and approach to software development.

## Version Info

# 2025.3.1
- Basic search using TIPLOC codes
- Table to show origin of train, destination, platform, arrival time at station and arrival time at final destination 
- Basic styling


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

