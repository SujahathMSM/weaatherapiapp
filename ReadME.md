Sure, here's a detailed `README.md` for your project:

---

# Weather API App

This project is a weather API application that provides weather updates to users via email. Users can register, login, and get weather updates for their specified locations.

## Table of Contents

- [Weather API App](#weather-api-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [API Endpoints](#api-endpoints)
    - [User Routes](#user-routes)
    - [Weather Routes](#weather-routes)
  - [Usage](#usage)
  - [Error Handling](#error-handling)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- User registration and authentication
- Fetch and store weather data
- Send weather updates via email
- Update user location and fetch new weather data
- Scheduled email updates using cron jobs

## Technologies

- Node.js
- Express.js
- MongoDB (Mongoose)
- bcrypt for password hashing
- JSON Web Token (JWT) for authentication
- Node-cron for scheduling tasks
- Nodemailer for sending emails
- express-validator for request validation
- async-handler for error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- Gmail account for sending emails (or another email service)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/weather-api-app.git
cd weather-api-app
```

2. Install dependencies:

```sh
npm install
```

3. Set up your environment variables (see [Environment Variables](#environment-variables)).

4. Start the application:

```sh
npm start
```

## Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
EMAIL=your_email_address
EMAIL_PASSWORD=your_email_password
ACCESS_TOKEN_SECRET=your_jwt_secret
```

## API Endpoints

### User Routes

- **Register User**
  - `POST /api/user/register`
  - Body: `{ "username": "string", "email": "string", "password": "string" }`

- **Login User**
  - `POST /api/user/login`
  - Body: `{ "email": "string", "password": "string" }`

- **Get Current User**
  - `POST /api/user/current`
  - Requires authentication

### Weather Routes

- **Save User Weather Data**
  - `POST /api/weather/save`
  - Requires authentication
  - Body: `{ "email": "string", "location": "string" }`

- **Update User Location**
  - `PUT /api/weather/update-location`
  - Requires authentication
  - Body: `{ "newLocation": "string" }`

- **Get User Weather Data**
  - `GET /api/weather/view`
  - Requires authentication
  - Query: `{ "email": "string" }`

- **Get Any Weather Data**
  - `GET /api/weather/any`
  - Requires authentication
  - Query: `{ "email": "string", "date": "string" }`

## Usage

1. **Register a new user:**
   ```sh
   curl -X POST http://localhost:3000/api/user/register -H "Content-Type: application/json" -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
   ```

2. **Login as the user:**
   ```sh
   curl -X POST http://localhost:3000/api/user/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Save weather data:**
   ```sh
   curl -X POST http://localhost:3000/api/weather/save -H "Authorization: Bearer <your_jwt_token>" -H "Content-Type: application/json" -d '{"email":"test@example.com","location":"New York"}'
   ```

4. **Update user location:**
   ```sh
   curl -X PUT http://localhost:3000/api/weather/update-location -H "Authorization: Bearer <your_jwt_token>" -H "Content-Type: application/json" -d '{"newLocation":"San Francisco"}'
   ```

5. **Get user weather data:**
   ```sh
   curl -X GET http://localhost:3000/api/weather/view -H "Authorization: Bearer <your_jwt_token>"
   ```

## Error Handling

This application uses `express-async-handler` to handle asynchronous errors. Errors are captured and sent as JSON responses with appropriate HTTP status codes.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

---

Feel free to modify the content as per your requirements and update the sections with any additional information.