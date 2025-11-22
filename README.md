# Real Estate - Property Listing Platform

A modern real estate property listing web application built with Angular 19. This is a portfolio project demonstrating full-stack Angular development with Firebase authentication and REST API integration.

## Features

- **User Authentication**: Firebase-based login and registration system
- **Property Listings**: Browse, filter, and view real estate listings
- **Advanced Filtering**: Filter by region, price range, area, and number of bedrooms
- **Property Details**: Detailed view with property information, agent contact details, and similar listings slider
- **Add Listing**: Create new property listings with image upload
- **Agent Management**: Add and manage real estate agents
- **Responsive Design**: Mobile-friendly UI using Bootstrap 5

## Tech Stack

- **Frontend**: Angular 19
- **Authentication**: Firebase Authentication
- **Styling**: Bootstrap 5, Custom CSS
- **Icons**: Bootstrap Icons
- **API**: REST API with token-based authentication

## Project Structure

```
src/app/
├── core/
│   ├── interceptors/      # HTTP interceptors (auth)
│   └── services/          # API services (auth, geo, listings, agents)
├── pages/
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── listings/          # Main listings page with filter panel
│   ├── listing-details/   # Property details with similar listings slider
│   └── add-listing/       # Add new property form
└── shared/
    ├── filter-panel/      # Filter component with custom dropdowns
    └── add-agent-modal/   # Agent creation modal
```

## Authentication Flow

The application uses a dual-token authentication system:
1. **Static API Token**: Required for API access
2. **Firebase Token**: User authentication via Firebase

When a user is not logged in, they are automatically redirected to the login page.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment files in `src/environments/`:
   - `environment.local.ts` - Development configuration
   - Add your Firebase config and API token

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`

### Building

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Demo Credentials

To test the application, you can register a new account or use Firebase Authentication test users.

## Screenshots

*Add screenshots of your application here*

## Author

Portfolio project - Real Estate Property Listing Platform

---

Built with Angular 19
