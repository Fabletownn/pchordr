module.exports = (client) => {
    process.on('unhandledRejection', (reason, promise) => {
        console.log(reason, promise);

        return client.channels.cache.get('890718960016838686').send(`<t:${Math.round(parseInt(Date.now()) / 1000)}:F> An error came through (unhandled rejection).\n\`\`\`${reason}\n${promise}\`\`\``);
    });

    process.on('uncaughtException', (reason, promise) => {
        console.log(reason, promise);

        return client.channels.cache.get('890718960016838686').send(`<t:${Math.round(parseInt(Date.now()) / 1000)}:F> An error came through (uncaught exception).\n\`\`\`${reason}\n${promise}\`\`\``);
    });

    process.on('uncaughtExceptionMonitor', (reason, promise) => {
        console.log(reason, promise);

        return client.channels.cache.get('890718960016838686').send(`<t:${Math.round(parseInt(Date.now()) / 1000)}:F> An error came through (monitor).\n\`\`\`${reason}\n${promise}\`\`\``);
    });

    process.on('rejectionHandled', (reason, promise) => {
        console.log(reason, promise);

        return client.channels.cache.get('890718960016838686').send(`<t:${Math.round(parseInt(Date.now()) / 1000)}:F> An error came through (promise rejection).\n\`\`\`${reason}\n${promise}\`\`\``);
    });
}