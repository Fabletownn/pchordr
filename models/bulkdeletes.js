const mongoose = require('mongoose');

const bulkdeletelogSchema = mongoose.Schema({
    messageID: String,
    log: String,
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }
});

module.exports = mongoose.model('bulkdeletes', bulkdeletelogSchema);