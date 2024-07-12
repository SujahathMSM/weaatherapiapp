const formatTimestamp = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", { timeZone: timezone });
};

const removeDuplicateHourlyData = (hourlyData) => {
    const uniqueData = {};
    hourlyData.forEach(item => {
        uniqueData[item.dt] = item;
    });
    return Object.values(uniqueData);
};
module.exports = { formatTimestamp, removeDuplicateHourlyData };