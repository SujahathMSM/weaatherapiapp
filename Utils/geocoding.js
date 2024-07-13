require('dotenv').config(); // To load environment variables from .env file
const fetchCoordinates = async (address) => {
    const apiKey = process.env.GEOCODING_API_KEY;

    if (!apiKey) {
        throw new Error('GEOCODING_API_KEY is not defined in the environment variables');
    }

    if (!address) {
        throw new Error('Address parameter is required');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status !== "OK") {
            throw new Error(`Geocoding error: ${data.status} - ${data.error_message || 'No additional information'}`);
        }

        if (data.results.length === 0) {
            throw new Error('No results found for the given address');
        }

        const location = data.results[0].geometry.location;

        if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
            throw new Error('Invalid location data received from Geocoding API');
        }

        return { lat: location.lat.toFixed(2), lon: location.lng.toFixed(2) };
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        throw new Error('Error fetching coordinates. Please try again later.');
    }
};

module.exports = fetchCoordinates;

