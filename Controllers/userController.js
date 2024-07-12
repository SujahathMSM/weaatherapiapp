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

const getWeatherDataForAnyDate = async(lat, lon, date) => {
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const weatherURL = `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${lat}&lon=${lon}&date=${date}&appid=${apiKey}`;

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

const getAllUserData = async (req, res) => {
    const {email} = req.query;

    if (!email){
        return res.status(400).send("Email is required")
    }

    try {
        const user = await User.findOne({ email: email });
        const formattedWeatherData = user.weatherData.hourly.map(element => ({
            ...element,
            date: new Date(element.dt * 1000).toLocaleString("en-US", { timeZone: user.weatherData.timezone })
        }));
        let dt = []
        const details = {
            "usermail" : user.email,
            "location" : user.location
        }
        dt.push(details)
        formattedWeatherData.forEach(element => {
            let detWeather = {};
            detWeather["date"] = element.date;
            detWeather['tempertaure'] = `${element.temp} °C`;
            detWeather['weather'] = element.weather[0];
            detWeather['Wind Speed'] = `${element.wind_speed} m/s`;
            dt.push(detWeather)

        });
        res.json(dt)
    } catch (error) {
        res.status(500).send("Error retrieving user data");
    }

    
}
const getUser = async (req, res) => {
    const { email, date } = req.query;

    if (!email || !date) {
        return res.status(400).send("Email and Date are required");
    }

    try {
        const user = await User.findOne({ email: email });
        // console.log(user.location)
        
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

        const userDetails = {
            "userEmail" : user.email,
            "location" : user.location
        }
        const wether = [];
        wether.push(userDetails)
        
        formattedWeatherData.forEach(element => {
            const data = {};
            data["date"] = element.date;
            data['temp'] = `${element.temp}°C`;
            data['weather'] = element.weather[0];
            
            // console.log(data)
            wether.push(data)
        });
        
        res.json(wether);
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

const formatDateToYMD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
}

const getAnyData = async (req, res) => {
    const {email, date} = req.query;
    if (!email){
        return res.status(400).send("Email is required")
    }
    if (!date){
        return res.status(400).send("Dateis required")
    }

    const newDate = formatDateToYMD(date);

    try {
        const user = await User.findOne({ email: email });
        const location = user.location;
        const { lat, lon } = await fetchCoordinates(location);
        const weatherData = await getWeatherDataForAnyDate(lat, lon, newDate);
        res.json(weatherData)
    } catch (error) {
        res.status(500).send("Error retrieving user data");
    }
}

module.exports = { getWeatherData, saveUser, getUser, updateLocation, getAllUserData, getAnyData };

