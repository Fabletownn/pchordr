const mongoose= require('mongoose');

const gtbLeaderboardSchema = mongoose.Schema({
    guildID: String,
    userID: String,
    points: Number
});

module.exports = mongoose.model('gtbleaderboard', gtbLeaderboardSchema);