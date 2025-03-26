const mongoose = require('mongoose');

const gtbSchema = mongoose.Schema({
    guildID: String,
    rounds: Map,
    currRound: Number
});

module.exports = mongoose.model('gtb', gtbSchema);