# Full-Stack FBI Most Wanted Application - React.js + Node.js + Docker

## Overview
This project consists of a React.js frontend and a Node.js backend, all containerized using Docker. The app fetches data from the FBI Wanted API and presents it in a user-friendly interface. The landing page shows a few wanted persons, and upon signing in, more wanted persons are displayed with search and filter options. The app also supports loading more paginated data.

## Prerequisites
To run the application, you need the following installed on your machine:
- **Docker** (for containerization)
- **Docker Compose** (for managing multi-container Docker applications)
- **Node.js** (for running the backend locally, if not using Docker)
- **npm** (Node.js package manager for installing dependencies)

## Installation

### 1. Without Docker
#### Clone the Repository
First, clone the repository to your local machine:

  git clone https://github.com/lawrencekm/fbi-wanted
  cd fbi-wanted


#### Frontend Setup (React.js)

Navigate to the client folder and install the required dependencies:

    cd client
    npm install
Start the Frontend
    npm start or npm run dev
The frontend will now be running on http://localhost:3000.


#### Backend Setup (Node.js)
Navigate to the server folder and install the required dependencies:

  cd ../server
  npm install
Start the Backend
  npm start or node index.js
The backend will now be running on http://localhost:3001.

### 2. With Docker
To run the app using Docker and Docker Compose, follow these steps.

Clone the Repository

    git clone https://github.com/lawrencekm/fbi-wanted
    cd fbi-wanted
Docker Compose Setup
Run the following command to bring up the frontend, backend, and MongoDB services:

    docker-compose up -d
This will start the services:

Frontend on http://localhost:8092
Backend on http://localhost:3001

#### User Authentication
To log in, use the following hardcoded credentials:

Email: admin@example.com
Password: password


### Using Prebuilt Docker Images (Optional)
Alternatively, you can pull the latest images from Docker Hub and update the docker-compose.yml file to reference them.

docker pull lawrencenjenga/wanted-backend:latest
docker pull lawrencenjenga/wanted-frontend:latest
Update the docker-compose.yml file to use these images.

services:
  backend:
    image: lawrencenjenga/wanted-backend:latest
    container_name: react-node-backend
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
    networks:
      - wanted-network

  frontend:
    image: lawrencenjenga/wanted-frontend:latest
    container_name: react-node-frontend
    ports:
      - "8092:3000"  # Match Next.js default port
    environment:
      - NEXTAUTH_SECRET=b31d032cfdcf47a399990a71e43c5d2a
      - REACT_APP_API_BASE_URL=http://react-node-backend:3001/api
    depends_on:
      - backend
    networks:
      - wanted-network

networks:
  wanted-network:
    driver: bridge

To start the updated containers, run the following commands:

    docker-compose down   # Stop current containers
    docker-compose pull   # Pull latest images
    docker-compose up     # Start updated containers
The app will now be accessible at http://localhost:8092.
### User Authentication
To log in, use the following hardcoded credentials:

Email: admin@example.com
Password: password


## Live DEMO
Checkout a live demo here: 
http://wanted.lawrencenjenga.com 


## Features
-Fetch and display FBI wanted persons: The app retrieves data from the FBI Wanted API and displays a list of persons.
-Search and filter functionality: Users can search and filter the list of wanted persons.
-Detailed view for each wanted person: A "See More" button displays detailed information for each person, including name, description, age, sex, and more.
-Pagination: The backend API supports pagination, displaying a limited number of results per page.
API Details
-The backend API serves data from the FBI Wanted API and supports pagination by accepting page and limit query parameters. The backend also supports ratelimiting of requests to prevent misuse.

GET /api/wanted?page=2&limit=5
  Pagination Parameters:
  page: The current page number (defaults to 1).
  limit: The number of items per page (defaults to 10).
  Pagination Metadata:

The API returns the following pagination metadata:

  totalPages: The total number of pages.
  currentPage: The current page number.
  totalItems: The total number of items.
  itemsPerPage: The number of items per page.

Response Structure
 The API response includes a data field for the items and a pagination field for metadata.

  json

  {
    "data": [
      { "title": "John Doe", "min_age": 35, "sex": "Male", ... },
      { "title": "Jane Doe", "min_age": 29, "sex": "Female", ... }
    ],
    "pagination": {
      "totalPages": 10,
      "currentPage": 1,
      "totalItems": 100,
      "itemsPerPage": 10
    }
  }



## Testing
-The backend application features tests for its endpoints.
-The first test for the /api/wanted endpoint checks if it correctly handles pagination and optional filters.
-The second test for the /api/wanted/:uid endpoint checks if it correctly fetches data for a specific wanted person.
-Both endpoints include tests for error scenarios where the FBI API fails.
- Frontend tests will be added.
To run the tests navigate to server folder

  cd server
  npm test

## Caching (Planned)
The application currently does not implement caching. This will be added in future releases to improve performance, especially when fetching large datasets from the FBI API.

## HTTPS (Planned)
Support for HTTPS is planned for future releases to ensure secure communication between the client and server.

## HTTPS (Planned)
The deployment of the application does not follow a clear CI/CD pipeline. Using Github Actions will be added to ensure seamless development-to-deployment workflow.

## Database authentication
A simple session based authentication using JWT is applied to demonstrate the idea. A robust database like mongoDb will be implemented for persistent storage of vital data such as users


## Other Notes
This app is a basic demonstration of fetching, displaying, and paginating data.
Caching, tests, and HTTPS are planned improvements.