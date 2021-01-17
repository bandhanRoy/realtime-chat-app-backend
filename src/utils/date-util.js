var { DateTime } = require('luxon');

/**
 * function returns current date time
 * @returns the current Data Time as a string
 */
function getCurrentDateTime() {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return String(DateTime.fromISO(new Date().toISOString(), { zone: timeZone }));
}

module.exports = {
    getCurrentDateTime: getCurrentDateTime
}