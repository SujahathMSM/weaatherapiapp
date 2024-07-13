# Weather API App

This Weather API App is a RESTful API that provides weather data based on user location. Users can register, log in, update their location, and retrieve weather data for current and specific dates. This app uses the OpenWeatherMap API to fetch weather data.

## Table of Contents

- [Weather API App](#weather-api-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Usage](#usage)
    - [Authentication](#authentication)
    - [Endpoints](#endpoints)
      - [User Registration](#user-registration)
      - [User Login](#user-login)
      - [Get Current User](#get-current-user)
      - [Save User Weather Data](#save-user-weather-data)
      - [Retrieve User Weather Data](#retrieve-user-weather-data)
      - [Update User Location](#update-user-location)
      - [Delete User](#delete-user)
    - [Validation](#validation)
    - [Error Handling](#error-handling)
  - [License](#license)

## Features

- User registration and login
- Token-based authentication (JWT)
- Update user location and fetch weather data
- Retrieve weather data for specific dates
- Delete user and associated weather data

## Installation

1. Clone the repository:

```bash
git clone https://github.com/SujahathMSM/weatherapiapp.git
```

2. Navigate to the project directory:

```bash
cd weatherapiapp
```

3. Install the dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=your_port_number
MONGO_URI=your_mongo_db_connection_string
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
ACCESS_TOKEN_SECRET=your_jwt_secret
```

## Environment Variables

Ensure you have the following environment variables set in your `.env` file:

- `PORT`: The port on which the server runs.
- `MONGO_URI`: MongoDB connection string.
- `OPENWEATHERMAP_API_KEY`: Your OpenWeatherMap API key.
- `ACCESS_TOKEN_SECRET`: Secret key for JWT token generation.

## Usage

### Authentication

The app uses JSON Web Tokens (JWT) for authentication. Users need to register and log in to obtain a token, which must be included in the `Authorization` header for protected routes.

### Endpoints

#### User Registration

- **Endpoint:** `POST /api/user/register`
- **Access:** Public
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

#### User Login

- **Endpoint:** `POST /api/user/login`
- **Access:** Public
- **Description:** Log in a user and get a JWT token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### Get Current User

- **Endpoint:** `GET /api/user/current`
- **Access:** Private
- **Description:** Get information about the current logged-in user.
- **Headers:**
  ```http
  Authorization: Bearer <token>
  ```

#### Save User Weather Data

- **Endpoint:** `POST /api/weather/save`
- **Access:** Private
- **Description:** Save user weather data based on location.
- **Query Parameters:**
  - `email`: User email
  - `location`: User location
- **Headers:**
  ```http
  Authorization: Bearer <token>
  ```

#### Retrieve User Weather Data

- **Endpoint:** `GET /api/weather/retrieve`
- **Access:** Private
- **Description:** Retrieve weather data for a specific date.
- **Query Parameters:**
  - `date`: Date in ISO8601 format
- **Headers:**
  ```http
  Authorization: Bearer <token>
  ```

#### Update User Location

- **Endpoint:** `PUT /api/weather/update-location`
- **Access:** Private
- **Description:** Update user location and fetch new weather data.
- **Query Parameters:**
  - `newLocation`: New user location
- **Headers:**
  ```http
  Authorization: Bearer <token>
  ```

#### Delete User

- **Endpoint:** `DELETE /api/user/delete`
- **Access:** Private
- **Description:** Delete a user and their weather data.
- **Headers:**
  ```http
  Authorization: Bearer <token>
  ```

### Validation

The app uses `express-validator` for request validation. Here are some validation rules applied to the endpoints:

- **Email:** Must be a valid email format.
- **Location:** Must not be empty.
- **Date:** Must be in ISO8601 format.

### Error Handling

The app uses `http-errors` for consistent error handling. Validation errors and other exceptions are caught and handled gracefully, returning appropriate HTTP status codes and error messages.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Feel free to customize this `README.md` as needed to better fit your project's specifics and any additional features or instructions you might want to include.