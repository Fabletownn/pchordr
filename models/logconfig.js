const mongoose = require('mongoose');

const logConfigSchema = mongoose.Schema({
    guildID: String,
    msglogid: String,
    ignoredchannels: Array,
    ignoredcategories: Array,
    logwebhook: String,
});

module.exports = mongoose.model('logconfig', logConfigSchema);