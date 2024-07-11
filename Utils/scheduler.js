// weatherapiapp/Utils/scheduler.js
const cron = require('node-cron');
const User = require('../Models/user');
const sendEmail = require('./mailer');
const getWeatherData = require('../Controllers/userController').getWeatherData;
const generateWeatherReport = require('./gemini');

const sendWeatherEmails = async () => {
    try {
        const users = await User.find();
        for (const user of users) {
            const weatherData = await getWeatherData(user.location);
            const weatherReport = await generateWeatherReport(weatherData);

            const emailContent = `
                Hello ${user.email},
                Here is your weather update for ${user.location}:
                ${weatherReport}
            `;

            await sendEmail(user.email, 'Weather Update', emailContent);
        }
    } catch (error) {
        console.error('Error sending emails:', error);
    }
};

const scheduleEmails = () => {
    // Send emails immediately upon server start
    sendWeatherEmails();

    // Schedule emails to be sent every three hours
    cron.schedule('0 */3 * * *', sendWeatherEmails);
};

module.exports = scheduleEmails;



