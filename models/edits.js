const mongoose = require('mongoose');

const editlogSchema = mongoose.Schema({
    guildID: String,
    overload: Number,
    embed: Array
});

module.exports = mongoose.model('edits', editlogSchema);