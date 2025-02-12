Full-Stack Application - React.js + Node.js
==========================================
This project consists of a React.js frontend and a Node.js backend, containerized using Docker. It fetches data from the FBI Wanted API and displays it in a user-friendly interface.

Prerequisites
=============
Docker and Docker Compose installed on your machine.


Installation


1.Without Docker
--------------
Clone the repository:

git clone <repository-url>
cd <repository-folder>

Frontend Setup (React.js):
-------------------------
Navigate to the client folder and install dependencies

cd client
npm install

Start the frontend
-------------------
npm start


Backend Setup (Node.js):
-------------------
Navigate to the server folder and install dependencies

cd ../server
npm install
npm run dev


2.With Docker
=============
Clone the repository and navigate to the project directory


git clone <repository-url>
cd <repository-folder>

docker-compose up -d

This will start the frontend, backend, and MongoDB services. The backend will be accessible on port 3001 and the frontend on port 8092.

Features
===========
Fetch and display FBI wanted persons.
Search and filter functionality.
Detailed view for each wanted person.
Simple backend to proxy data from the FBI API.

To login, use hardcoded credentials
---------------------------------
admin@example.com & password = "password"

Notes
----
The application does not yet include tests or caching.