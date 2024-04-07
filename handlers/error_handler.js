const fs = require('fs');

module.exports = (client, Discord) => {
    const load_dir = (dirs) => {
        process.on('unhandledRejection', (reason, promise) => {
            console.log(reason, promise);
            return console.log(`An unhandled rejection error came through.\n${reason}\n${promise}`);
        });

        process.on('uncaughtException', (reason, promise) => {
            console.log(reason, promise);
            return console.log(`An uncaught exception error came through.\n${reason}\n${promise}`);
        });

        process.on('uncaughtExceptionMonitor', (reason, promise) => {
            console.log(reason, promise);
            return console.log(`An uncaught exception error came through via Monitor.\n${reason}\n${promise}`);
        });

        process.on('rejectionHandled', (reason, promise) => {
            console.log(reason, promise);
            return console.log(`A promise rejection error came through.\n${reason}\n${promise}`);
        });
    }

    ['guild'].forEach(e => load_dir(e));
}