const User = require('../Models/user');
const getWeatherData = async (city) => {
    const apiKey = "fca4c2186e341e599c016a70a016a787";
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
    try {
        const response = await fetch(weatherURL);
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.log("Error fetching weather data:", error);
        throw error;
    }
}

const saveuser = async (req, res) => {
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

const getUser =  async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).send("Email is required");
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.json(user);
    } catch (error) {
        res.status(500).send("Error retrieving user data");
    }
}


module.exports = {getWeatherData, saveuser, getUser}
