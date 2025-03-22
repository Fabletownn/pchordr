const mongoose = require('mongoose');

const voiceSchema = mongoose.Schema({
    voiceID: String,
    ownerID: String
});

module.exports = mongoose.model('voices', voiceSchema);