const mongoose = require('mongoose');

const logConfigSchema = mongoose.Schema({
    guildID: String,
    deletelogid: String,
    editlogid: String,
    ignoredchannels: Array,
    ignoredcategories: Array,
    deletewebhook: String,
    editwebhook: String
});

module.exports = mongoose.model('logconfig', logConfigSchema);