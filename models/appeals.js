const mongoose = require("mongoose");

const appealsSchema = mongoose.Schema({
    guildID: String,
    msgID: String,
    userID: String,
    appealmsg: String,
    notes: String,
    attachs: String
});

module.exports = mongoose.model("appeals", appealsSchema);