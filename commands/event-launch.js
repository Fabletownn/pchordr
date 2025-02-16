const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-launch')
        .setDescription('Unlocks beginning event channels if one has started')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('event')
                .setDescription('What event should be started?')
                .setRequired(true)
                .addChoices({
                    name: 'Fortnite Custom',
                    value: 'fortnite_custom'
                }, {
                    name: 'Server Event',
                    value: 'server_event'
                }, {
                    name: 'Discord Stream',
                    value: 'discord_stream'
                }, {
                    name: 'Discord Movie',
                    value: 'discord_movie'
                })
        ),
    async execute(interaction) {
        const to_launch = interaction.options.get('event').value;

        //////////// Channels
        const serverEventsVC = interaction.guild.channels.cache.get('815790709646163968');
        const movieEventsVC = interaction.guild.channels.cache.get('1160656322103087175');
        const streamChat = interaction.guild.channels.cache.get('973751203756400660');
        const customsCodeChat = interaction.guild.channels.cache.get('1198018037538881586');

        //////////// Role IDs
        const serverEventsRole = '731212776936308777';
        const discordStreamsRole = '816705412451008542';
        const fortniteCustomsRole = '731217324765479053';

        switch (to_launch) {
            case "discord_stream": // (Discord Streams role) Enable permissions for Server Events and Stream Chat
                await serverEventsVC.permissionOverwrites.edit(discordStreamsRole, {
                    ViewChannel: true,
                    Connect: true
                });

                await streamChat.permissionOverwrites.edit(discordStreamsRole, {
                    ViewChannel: true,
                    SendMessages: true
                });

                await interaction.reply({ content: `Unlocked the ${serverEventsVC} and ${streamChat} channels for the <@&${discordStreamsRole}> role. <:bITFVictory:1063265610303295619>`, allowedMentions: { parse: [] } });
                break;
            case "server_event": // (Server Events role) Enable permissions for Server Events and Stream Chat
                await serverEventsVC.permissionOverwrites.edit(serverEventsRole, {
                    ViewChannel: true,
                    Connect: true
                });

                await streamChat.permissionOverwrites.edit(serverEventsRole, {
                    ViewChannel: true,
                    SendMessages: true
                });

                await interaction.reply({ content: `Unlocked the ${serverEventsVC} and ${streamChat} channels for the <@&${serverEventsRole}> role. <:bITFVictory:1063265610303295619>`, allowedMentions: { parse: [] } });
                break;
            case "fortnite_custom": // (Fortnite Customs role) Enable permissions for Server Events, Customs Chat, and Stream Chat
                await serverEventsVC.permissionOverwrites.edit(fortniteCustomsRole, {
                    ViewChannel: true,
                    Connect: true
                });

                await customsCodeChat.permissionOverwrites.edit(fortniteCustomsRole, {
                    ViewChannel: true
                });

                await streamChat.permissionOverwrites.edit(fortniteCustomsRole, {
                    ViewChannel: true,
                    SendMessages: true
                });

                await interaction.reply({ content: `Unlocked the ${serverEventsVC}>, ${customsCodeChat}, and ${streamChat} channels for the <@&${fortniteCustomsRole}> role. <:bITFVictory:1063265610303295619>`, allowedMentions: { parse: [] } });
                break;
            case "discord_movie": // (Discord Streams role) Enable permissions for Discord Movies and Stream Chat
                await movieEventsVC.permissionOverwrites.edit(discordStreamsRole, {
                    ViewChannel: true,
                    Connect: true
                });

                await streamChat.permissionOverwrites.edit(discordStreamsRole, {
                    ViewChannel: true,
                    SendMessages: true
                });

                await interaction.reply({ content: `Unlocked the ${movieEventsVC} and ${streamChat} channels for the <@&${discordStreamsRole}> role. <:bITFVictory:1063265610303295619>`, allowedMentions: { parse: [] } });
                break;
            default:
                break;
        }
    },
};