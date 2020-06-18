const moment = require("moment");

function formatMessage(username, text, sala) {
    return {
        username,
        text,
        time: moment().format('h:mm a'),
        sala
    }
}

module.exports = formatMessage