const mongoose = require("mongoose");

const customSchema = mongoose.Schema({
    guildID: String,
    roleID: String,
    roleColor: String,
    roleOwner: String
});

module.exports = mongoose.model("customs", customSchema);