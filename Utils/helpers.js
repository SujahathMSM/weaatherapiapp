const formatTimestamp = (timestamp, timezone) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("en-US", { timeZone: timezone });
};

module.exports = { formatTimestamp };