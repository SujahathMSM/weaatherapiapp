const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true,
    },
    weatherData: {
        type: Object // Change to Object to match the structure of weather data from the API
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User;
