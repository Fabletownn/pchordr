const mongoose = require("mongoose");

const pointsSchema = mongoose.Schema({
    guildID: String,
    userID: String,
    name: String,
    points: Number,
    lb: String
});

module.exports = mongoose.model("points", pointsSchema);