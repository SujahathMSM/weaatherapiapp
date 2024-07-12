const cron = require("node-cron");
const User = require("../Models/user");
const sendEmail = require("./mailer");
const { getWeatherData } = require("../Controllers/userController");
const generateWeatherReport = require("./gemini");
const fetchCoordinates = require("./geocoding");
const { formatTimestamp, removeDuplicateHourlyData } = require("./helpers");

const sendWeatherEmails = async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const { lat, lon } = await fetchCoordinates(user.location);
      const weatherData = await getWeatherData(lat, lon);

      // Log the weatherData to see its structure
      // console.log('Weather data structure:', JSON.stringify(weatherData, null, 2));

      if (!weatherData.current || !weatherData.hourly || !weatherData.daily) {
        throw new Error("Incomplete weather data");
      }

      const weatherReport = await generateWeatherReport(weatherData, user.location);

      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: weatherData.timezone,
      });

      const formatDateTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString("en-US", { timeZone: weatherData.timezone });
      };

      // Update user weather data
      const updatedHourlyData = user.weatherData.hourly.concat(
        weatherData.hourly
      );
      const updatedUser = await User.findOneAndUpdate(
        { email: user.email },
        { "weatherData.hourly": updatedHourlyData },
        { new: true }
      );

      // Remove duplicates and save cleaned data back to the database
      const cleanedHourlyData = removeDuplicateHourlyData(updatedHourlyData);
      await User.findOneAndUpdate(
          { email: user.email },
          { 'weatherData.hourly': cleanedHourlyData },
          { new: true }
      );

      const emailContent = `
      <html>
      <head>
          <style>
              /* Define CSS styles for the email */
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
              }
              th {
                  background-color: #f2f2f2;
              }
              .weather-summary {
                  font-style: italic;
              }
          </style>
      </head>
      <body>
          <table>
              <tr>
                  <th colspan="2">----Welcome ${user.email}-----</th>
              </tr>
              <tr>
                  <td colspan="2">Current weather of ${user.location}</td>
              </tr>
              <tr>
                  <td>Date:</td>
                  <td>${currentTime.split(", ")[0]}</td>
              </tr>
              <tr>
                  <td>Time:</td>
                  <td>${currentTime.split(", ")[1]}</td>
              </tr>
              <tr>
                  <td>Sunrise:</td>
                  <td>${formatTimestamp(weatherData.current.sunrise, weatherData.timezone)}</td>
              </tr>
              <tr>
                  <td>Sunset:</td>
                  <td>${formatTimestamp(weatherData.current.sunset, weatherData.timezone)}</td>
              </tr>
              <tr>
                  <td colspan="2">
                      <h4>Detailed Current Weather:</h4>
                      <ul>
                          <li>Temperature: ${weatherData.current.temp}°C</li>
                          <li>Weather: ${weatherData.current.weather[0].description}</li>
                          <li>Humidity: ${weatherData.current.humidity}%</li>
                          <li>Wind Speed: ${weatherData.current.wind_speed} m/s</li>
                      </ul>
                  </td>
              </tr>
              <tr>
                  <td colspan="2">
                      <h4>Forecast for next 4 hours:</h4>
                      <table>
                          <tr>
                              <th>Time</th>
                              <th>Temperature</th>
                              <th>Feels Like</th>
                              <th>Weather</th>
                          </tr>
                          ${weatherData.hourly
                              .slice(1, 5)
                              .map(
                                  (hour) => `
                                  <tr>
                                      <td>${new Date(hour.dt * 1000)
                                          .toLocaleString("en-US", { timeZone: weatherData.timezone })
                                          .split(", ")[1]}</td>
                                      <td>${hour.temp}°C</td>
                                      <td>${hour.feels_like}°C</td>
                                      <td>${hour.weather[0].description}</td>
                                  </tr>
                              `
                              )
                              .join("")}
                      </table>
                  </td>
              </tr>
              <tr>
                  <td colspan="2">
                      <h4>Forecast for next 4 days:</h4>
                      <table>
                          <tr>
                              <th>Date</th>
                              <th>Summary</th>
                              <th>Temperature</th>
                              <th>Min Temp</th>
                              <th>Max Temp</th>
                              <th>Weather</th>
                          </tr>
                          ${weatherData.daily
                              .slice(1, 5)
                              .map(
                                  (day) => `
                                  <tr>
                                      <td>${new Date(day.dt * 1000).toLocaleDateString("en-US", {
                                          timeZone: weatherData.timezone,
                                      })}</td>
                                      <td>${day.summary || day.weather[0].description}</td>
                                      <td>${day.temp.day}°C</td>
                                      <td>${day.temp.min}°C</td>
                                      <td>${day.temp.max}°C</td>
                                      <td>${day.weather[0].description}</td>
                                  </tr>
                              `
                              )
                              .join("")}
                      </table>
                  </td>
              </tr>
              <tr>
                  <td colspan="2">
                      <h4 class="weather-summary">Weather Summary:</h4>
                      <p>${weatherReport}</p>
                  </td>
              </tr>
          </table>
      </body>
      </html>
  `;

      await sendEmail(user.email, "Weather Update", emailContent);
    }
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};

const scheduleEmails = () => {
  sendWeatherEmails();

  cron.schedule("0 */3 * * *", sendWeatherEmails);
};

module.exports = scheduleEmails;
