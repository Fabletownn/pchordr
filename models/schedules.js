const mongoose = require("mongoose");

const schedSchema = mongoose.Schema({
    guildID: String,
    scheduleID: String,
    timeScheduled: String,
    sayChannel: String,
    sayMessage: String,
    sayImage: String
});

module.exports = mongoose.model("schedules", schedSchema);