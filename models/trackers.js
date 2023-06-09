const mongoose = require("mongoose");

const trackSchema = mongoose.Schema({
    guildID: String,
    userID: String,
    limit: Number,
    channel: String,
    sent: Number,
    log: String,
    session: Number
});

module.exports = mongoose.model("trackers", trackSchema);