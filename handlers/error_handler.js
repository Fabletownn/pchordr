module.exports = (client) => {
    const consoleError = console.error;
    const errorLog = (type, error) => {
        const unixTS = `<t:${Math.round(Date.now() / 1000)}:F>`;
        const errorMessage = (error instanceof Error ? `${error.stack}` : `${error}`);
        const botChannel = client.channels.cache.get('890718960016838686');

        if (botChannel) return botChannel.send({ content: `${unixTS} **${type}** error log:\n\`\`\`${errorMessage}\`\`\`` });
    };

    process.on('unhandledRejection', (reason, promise) => {
        console.log(reason, promise);
        errorLog('Unhandled Rejection', reason);
    });

    process.on('uncaughtException', (error) => {
        console.log(error);
        errorLog('Uncaught Exception', error);
    });

    process.on('uncaughtExceptionMonitor', (error) => {
        console.log(error);
        errorLog('Monitor', error);
    });

    process.on('rejectionHandled', (promise) => {
        console.log(promise);
        errorLog('Promise Rejection', promise);
    });

    console.error = (...args) => {
        consoleError.apply(console, args);

        args.forEach((arg) => errorLog('Console Error', arg));
    };
};