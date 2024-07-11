const { json } = require('express');
const User = require('../Models/user');
const getWeatherData = async (city) => {
    const apiKey = "fca4c2186e341e599c016a70a016a787";
    const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`; // Note: Changed endpoint to 5-day/3-hour forecast
    try {
        const response = await fetch(weatherURL);
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.log("Error fetching weather data:", error);
        throw error;
    }
}

const saveUser = async (req, res) => {
    const { email, location } = req.query;

    if (!email || !location) {
        return res.status(400).send("Email and location are required");
    }

    try {
        const weatherData = await getWeatherData(location);

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
}

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

        const matchedWeatherData = user.weatherData.list.filter(element => date === element.dt_txt.split(" ")[0]);

        res.json(matchedWeatherData);
    } catch (error) {
        res.status(500).send("Error retrieving user data");
    }
}


const updateLocation = async (req, res) => {
    const { email, newLocation } = req.body;

    if (!email || !newLocation) {
        return res.status(400).send("Email and new location are required");
    }

    try {
        // Fetch new weather data for the new location
        const weatherData = await getWeatherData(newLocation);

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
}


module.exports = {getWeatherData, saveUser, getUser, updateLocation}
