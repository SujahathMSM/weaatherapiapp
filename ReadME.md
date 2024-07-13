# Weather API APP - AWS-EC2

## Introduction

The Weather API hosted on AWS EC2 provides a set of endpoints for user management, weather data management, and retrieval. This API allows users to register, authenticate, save, retrieve, update, and delete weather data associated with their accounts.

**Base URL:** `http://13.53.107.142/api`

## Table of Contents

- [Authentication](#authentication)
- [Users](#users)
  - [Register New User](#register-new-user)
  - [Login](#login)
  - [View User Details](#view-user-details)
- [Weather Data](#weather-data)
  - [Save Weather Data](#save-weather-data)
  - [Retrieve Saved Weather Data](#retrieve-saved-weather-data)
  - [Update User's Location](#update-users-location)
  - [Retrieve Weather Data by Date](#retrieve-weather-data-by-date)
  - [Get Weather Data for Given Date](#get-weather-data-for-given-date)
  - [Delete User and Weather Data](#delete-user-and-weather-data)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [License](#license)

## Authentication

Authentication for accessing protected endpoints is handled via JWT (JSON Web Tokens). Users obtain a token through the login endpoint and include it in the `Authorization` header for subsequent requests.

## Users

### Register New User

- **Endpoint**: `POST /user/register`
- **Description**: Registers a new user with the system.
- **Request Body**:
    ```json
    {
      "username": "awsapitester",
      "email": "sujahathmsm98@gmail.com",
      "password": "awsapitester1234"
    }
    ```

### Login

- **Endpoint**: `POST /user/login`
- **Description**: Authenticates a user and generates a JWT token.
- **Request Body**:
    ```json
    {
      "email": "sujahathmsm98@gmail.com",
      "password": "awsapitester1234"
    }
    ```

### View User Details

- **Endpoint**: `GET /user/current`
- **Description**: Retrieves details of the currently logged-in user.
- **Authorization**: Bearer Token required.

## Weather Data

### Save Weather Data

- **Endpoint**: `POST /weather/save`
- **Description**: Saves weather data for a specific location.
- **Query Parameters**:
    - `email`: User's email address
    - `location`: Location for which weather data is being saved.
- **Authorization**: Bearer Token required.

### Retrieve Saved Weather Data

- **Endpoint**: `GET /weather/view`
- **Description**: Retrieves all saved weather data associated with the current user.
- **Authorization**: Bearer Token required.

### Update User's Location

- **Endpoint**: `PUT /weather/update-location`
- **Description**: Updates the location associated with the current user.
- **Query Parameters**:
    - `newLocation`: New location to update.
- **Authorization**: Bearer Token required.

### Retrieve Weather Data by Date

- **Endpoint**: `GET /weather/retrieve`
- **Description**: Retrieves weather data for a specific date from the database.
- **Query Parameters**:
    - `date`: Date for which weather data is requested (e.g., `2024-07-13`).
- **Authorization**: Bearer Token required.

### Get Weather Data for Given Date

- **Endpoint**: `GET /weather/any`
- **Description**: Retrieves weather data for any given date.
- **Query Parameters**:
    - `date`: Date for which weather data is requested (e.g., `2004-12-25`).
- **Authorization**: Bearer Token required.

### Delete User and Weather Data

- **Endpoint**: `DELETE /weather/delete`
- **Description**: Deletes the current user and associated weather data.
- **Authorization**: Bearer Token required.

## Validation

The app uses `express-validator` for request validation. Here are some validation rules applied to the endpoints:

- **Email:** Must be a valid email format.
- **Location:** Must not be empty.
- **Date:** Must be in ISO8601 format.

## Error Handling

The app uses `http-errors` for consistent error handling. Validation errors and other exceptions are caught and handled gracefully, returning appropriate HTTP status codes and error messages.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Feel free to further customize this `README.md` as needed to better fit your project's specifics and any additional features or instructions you might want to include.
## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Feel free to customize this `README.md` as needed to better fit your project's specifics and any additional features or instructions you might want to include.
