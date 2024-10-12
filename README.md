# Weather Application with User Management and Favorites

This is a Node.js-based weather application that allows users to register, authenticate, and manage their favorite cities' weather. The application fetches weather data using an external API, with Redis caching for performance optimization. Additionally, users can update their details and manage their favorite cities.

## Features

- User registration and authentication
- Fetch real-time weather data for any city
- Add and manage favorite cities
- Redis caching for weather data to improve performance
- RESTful API documented with Swagger

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Elksass315/node_Weather
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

To start the server in development mode:
```bash
npm run dev
```

To run tests:
```bash
npm test
```

## Viewing API Documentation

Swagger documentation is available after starting the server. You can view the documentation at:
```
http://localhost:3000/api-docs
```

## Caching

This project uses Redis to cache weather data for 1 hour, reducing the need to fetch data from the weather API repeatedly.