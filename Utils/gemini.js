//weatherapiapp/Utils/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // To load environment variables from .env file

// Access your API key as an environment variable.
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI("AIzaSyB9uSAq1wFenfPz4S6YbL60Uyn-MiahnCw");

const generateWeatherText = async (weatherData) => {
    try {
        // Choose a model that's appropriate for your use case.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const jsonData = JSON.stringify(weatherData, null, 2);
        const prompt = `Write a comprehensive weather summary on below data, just one paragraph is enough, use the current day's and next three day's details\n${jsonData}`;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();
        return response;
    } catch (error) {
        console.error('Error generating weather text:', error);
        return 'Could not generate weather text.';
    }
};

module.exports = generateWeatherText;
