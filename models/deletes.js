const mongoose = require('mongoose');

const deletelogSchema = mongoose.Schema({
    guildID: String,
    overload: Number,
    embed: Array
});

module.exports = mongoose.model('deletes', deletelogSchema);