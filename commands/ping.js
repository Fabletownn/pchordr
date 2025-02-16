const sf = require('seconds-formater');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Provides the bot\'s ping, trip latency, and heartbeat'),
    async execute(interaction) {
        let client = interaction.client;

        const pingReceived = await interaction.reply({
            content: 'Received ping..',
            fetchReply: true,
            ephemeral: false
        });

        const tripLatency = Math.round(pingReceived.createdTimestamp - interaction.createdTimestamp).toLocaleString();
        const botHeartbeat = client.ws.ping.toLocaleString();

        const uptimeInSeconds = (client.uptime / 1000) || 0;

        await interaction.editReply({ content: `Pong! <:bITFGG:1022548636481114172>\n\nUptime: ${sf.convert(uptimeInSeconds).format('**Dd Hh Mm** and **Ss**')}\nTrip Latency: **${tripLatency}ms**\nHeartbeat: **${botHeartbeat}ms**` });
    },
};