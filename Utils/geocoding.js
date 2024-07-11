//weatherapiapp/Utils/geocoding.js
const fetchCoordinates = async (address) => {
    const apiKey = process.env.GEOCODING_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status !== "OK") {
            throw new Error(`Geocoding error: ${data.status}`);
        }
        const location = data.results[0].geometry.location;
        return { lat: location.lat.toFixed(2), lon: location.lng.toFixed(2) };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};

module.exports = fetchCoordinates;
