const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    kind: {
        type: String,
        required: true
    },
    data: {
        type: JSON,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: Array,
        required: true
    }
})

const Notification = mongoose.model("notification", NotificationSchema);

module.exports = Notification;