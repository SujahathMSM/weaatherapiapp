const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // To load environment variables from .env file

// Access your API key as an environment variable.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

const generateWeatherText = async (weatherData, location) => {
    try {
        // Ensure the weatherData and location are provided
        if (!weatherData || !location) {
            throw new Error('Missing required parameters: weatherData or location');
        }

        // Choose a model that's appropriate for your use case.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        if (!model) {
            throw new Error('Failed to get the generative model');
        }

        const jsonData = JSON.stringify(weatherData, null, 2);
        const prompt = `Write a comprehensive weather summary for ${location} on below data, just a paragraph is enough to explain the weather data\n${jsonData}`;

        const result = await model.generateContent(prompt);

        if (!result || !result.response) {
            throw new Error('No response from the generative model');
        }

        const response = await result.response.text();
        return response;
    } catch (error) {
        console.error('Error generating weather text:', error.message);
        return 'Could not generate weather text.';
    }
};

module.exports = generateWeatherText;

