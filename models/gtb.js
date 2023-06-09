const mongoose = require("mongoose");

const gtbSchema = mongoose.Schema({
    guildID: String,
    round1: Array,
    round2: Array,
    round3: Array,
    round4: Array,
    round5: Array,
    round6: Array,
    round7: Array,
    round8: Array,
    round9: Array,
    round10: Array,
    round11: Array,
    round12: Array,
    round13: Array,
    round14: Array,
    round15: Array,
    round16: Array,
    round17: Array,
    round18: Array,
    round19: Array,
    round20: Array
});

module.exports = mongoose.model("gtbs", gtbSchema);