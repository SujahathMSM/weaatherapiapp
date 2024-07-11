//weatherapiapp/Controllers/userController.js
const User = require('../Models/user');
const fetchCoordinates = require('../Utils/geocoding');
const generateWeatherReport = require('../Utils/gemini');

const getWeatherData = async (lat, lon) => {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(weatherURL);
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.log("Error fetching weather data:", error);
        throw error;
    }
};

const saveUser = async (req, res) => {
    const { email, location } = req.query;

    if (!email || !location) {
        return res.status(400).send("Email and location are required");
    }

    try {
        const { lat, lon } = await fetchCoordinates(location);
        const weatherData = await getWeatherData(lat, lon);

        // Save the user information along with the weather data to the database
        const user = new User({
            email: email,
            location: location,
            weatherData: weatherData
        });

        await user.save();

        res.json({ message: "Weather data saved successfully", weatherData });
    } catch (error) {
        res.status(500).send("Error fetching Weather Data");
    }
};

// Note: No changes to getUser function required
const getUser = async (req, res) => {
    const { email, date } = req.query;

    if (!email) {
        return res.status(400).send("Email is required");
    }

    try {
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).send("User not found");
        }

        const matchedWeatherData = user.weatherData.hourly.filter(element => {
            const elementDate = new Date(element.dt * 1000).toISOString().split('T')[0];
            return date === elementDate;
        });

        const formattedWeatherData = matchedWeatherData.map(element => ({
            ...element,
            date: new Date(element.dt * 1000).toLocaleString("en-US", { timeZone: user.weatherData.timezone })
        }));

        res.json(formattedWeatherData);
    } catch (error) {
        res.status(500).send("Error retrieving user data");
    }
};

const updateLocation = async (req, res) => {
    const { email, newLocation } = req.body;

    if (!email || !newLocation) {
        return res.status(400).send("Email and new location are required");
    }

    try {
        const { lat, lon } = await fetchCoordinates(newLocation);
        const weatherData = await getWeatherData(lat, lon);

        // Find the user by email and update their location and weather data
        const user = await User.findOneAndUpdate(
            { email: email },
            { location: newLocation, weatherData: weatherData },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.json({ message: "Location updated successfully", weatherData });
    } catch (error) {
        res.status(500).send("Error updating location");
    }
};

module.exports = { getWeatherData, saveUser, getUser, updateLocation };

