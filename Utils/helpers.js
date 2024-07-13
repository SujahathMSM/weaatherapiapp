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

const formatDateToYMD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
}
module.exports = { formatTimestamp, removeDuplicateHourlyData, formatDateToYMD };