const cron = require('node-cron');
const User = require('../Models/user');
const sendEmail = require('./mailer');
const { getWeatherData } = require('../Controllers/userController');
const generateWeatherReport = require('./gemini');
const fetchCoordinates = require('./geocoding');
const { formatTimestamp } = require('./helpers');

const sendWeatherEmails = async () => {
    try {
        const users = await User.find();
        for (const user of users) {
            const { lat, lon } = await fetchCoordinates(user.location);
            const weatherData = await getWeatherData(lat, lon);

            // Log the weatherData to see its structure
            // console.log('Weather data structure:', JSON.stringify(weatherData, null, 2));

            if (!weatherData.current || !weatherData.hourly || !weatherData.daily) {
                throw new Error('Incomplete weather data');
            }

            const weatherReport = await generateWeatherReport(weatherData);

            const currentTime = new Date().toLocaleString("en-US", { timeZone: weatherData.timezone });

            const formatDateTime = (timestamp) => {
                const date = new Date(timestamp * 1000);
                return date.toLocaleString("en-US", { timeZone: weatherData.timezone });
            };

            // Update user weather data
            const updatedHourlyData = user.weatherData.hourly.concat(weatherData.hourly);
            const updatedUser = await User.findOneAndUpdate(
                { email: user.email },
                { 'weatherData.hourly': updatedHourlyData },
                { new: true }
            );

            const emailContent = `
                ----Welcome ${user.email}-----
                Current weather of ${user.location}
                Date: ${currentTime.split(", ")[0]}
                Time: ${currentTime.split(", ")[1]}
                Sunrise: ${formatTimestamp(weatherData.current.sunrise, weatherData.timezone)}
                Sunset: ${formatTimestamp(weatherData.current.sunset, weatherData.timezone)}

                Detailed Current Weather:
                Temperature: ${weatherData.current.temp}°C
                Weather: ${weatherData.current.weather[0].description}
                Humidity: ${weatherData.current.humidity}%
                Wind Speed: ${weatherData.current.wind_speed} m/s

                Forecast for next 4 hours:
                ${weatherData.hourly.slice(0, 4).map(hour => `
                Time: ${new Date(hour.dt * 1000).toLocaleString("en-US", { timeZone: weatherData.timezone }).split(", ")[1]}
                Temperature: ${hour.temp}°C
                Feels Like: ${hour.feels_like}°C
                Weather: ${hour.weather[0].description}
                `).join('\n')}

                Forecast for next 4 days:
                ${weatherData.daily.slice(1, 5).map(day => `
                Date: ${new Date(day.dt * 1000).toLocaleDateString("en-US", { timeZone: weatherData.timezone })}
                Summary : ${day.summary}
                Temperature: ${day.temp.day}°C
                Minimum Temp: ${day.temp.min}°C
                Maximum Temp: ${day.temp.max}°C
                Weather: ${day.weather[0].description}
                `).join('\n')}

                Weather Summary:
                ${weatherReport}
            `;

            await sendEmail(user.email, 'Weather Update', emailContent);
        }
    } catch (error) {
        console.error('Error sending emails:', error);
    }
};

const scheduleEmails = () => {
    sendWeatherEmails();

    cron.schedule('0 */3 * * *', sendWeatherEmails);
};

module.exports = scheduleEmails;



