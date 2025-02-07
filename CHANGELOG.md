# Changelog

## [1.2.0] - 2025-02-01
### Added
- **Favourite Places Selection**: Added functionality to handle selection of favourite places in `famousPlaces/models/functions`.
- **Image Retrieval**: Updated `getPlace` to retrieve images from storage.

### Refactored
- **Auth Models**: Destructured `handleRegisterUser` for better readability and maintainability.
- **Prisma Seed Script**: Added initialization script for Prisma and updated the seed file.
- **App Codebase**: Applied Prettier formatting across the codebase.
- **Famous Places Functions**: 
  - Removed unnecessary case 3 in `fetchPlaces`.
  - Replaced index with descriptive strings for filtering places.

### Fixed
- **Prisma Schema**: Made `price` and `hoursTravel` fields compulsory.

### Build
- **Prisma Upgrade**: Updated Prisma to the latest version in `package.json`.

---

## [1.1.0] - 2025-01-23
### Added
- **Fake API Meteo**: Introduced a fake API for weather-related data (`fakeApiMeteo`).
- **Price Field in Prisma**: Added a `price` field to the Prisma schema.

### Fixed
- **Famous Places Model**: Updated `handlesGetPlaces` to fetch images from the bucket.

### Refactored
- **App Codebase**: Cleaned up random log entries.
- **GraphQL Famous Places**: Corrected the misspelling of "hoursTravel."

---

## [1.0.0] - 2025-01-13
### Added
- **Initial Release**: Launched the application with core features.
- **Authorization Token Handling**: Implemented token handling for mobile authorization.
- **Fetch Famous Places**: Added functionality to fetch and display famous places.