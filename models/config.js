const mongoose = require("mongoose");

const configSchema = mongoose.Schema({
    guildID: String,
    generalChat: String,
    modChat: String,
    serverUpdatesChat: String,
    pollsChat: String,
    artChat: String,
    gpChat: String,
    supportersChat: String,
    gtbChat: String,
    adminRole: String,
    modRole: String,
    supportersRole: String,
    boosterRole: String,
    ytRole: String,
    twitchRole: String,
    gtbRole: String,
    autopublish: Boolean,
    vxtwitter: Boolean,
    artdelete: Boolean,
    greeting: Boolean
});

module.exports = mongoose.model("rconfigs", configSchema);