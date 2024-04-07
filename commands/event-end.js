const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-end')
        .setDescription('Locks ongoing event channels if one has ended')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('event')
                .setDescription('What ongoing event should be closed down?')
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
        const to_end = interaction.options.get('event').value;

        //////////// Channels
        const serverEventsVC = interaction.guild.channels.cache.get('815790709646163968');
        const movieEventsVC = interaction.guild.channels.cache.get('1160656322103087175');
        const streamChat = interaction.guild.channels.cache.get('973751203756400660');
        const customsCodeChat = interaction.guild.channels.cache.get('1198018037538881586');

        //////////// Role IDs
        const serverEventsRole = '731212776936308777';
        const discordStreamsRole = '816705412451008542';
        const fortniteCustomsRole = '731217324765479053';

        switch (to_end) {
            case "discord_stream": // (Discord Streams role) Disable permissions for Server Events and Stream Chat
                await serverEventsVC.permissionOverwrites.edit(discordStreamsRole, {
                    ViewChannel: false,
                    Connect: false
                });

                await streamChat.permissionOverwrites.edit(discordStreamsRole, {
                    ViewChannel: false,
                    SendMessages: false
                });

                if (serverEventsVC.members.size > 0) {
                    serverEventsVC.members.each(async (member) => {
                        await member.voice.disconnect();
                    });
                }

                await interaction.reply({ content: `Closed up the ${serverEventsVC} (all members disconnected) and ${streamChat} channels for the <@&${discordStreamsRole}> role. Hope you had fun! <:bITFWave:1022548691988512778>`, allowedMentions: { parse: [] } });
                break;
            case "server_event": // (Server Events role) Disable permissions for Server Events and Stream Chat
                await serverEventsVC.permissionOverwrites.edit(serverEventsRole, {
                    ViewChannel: false,
                    Connect: false
                });

                await streamChat.permissionOverwrites.edit(serverEventsRole, {
                    ViewChannel: false,
                    SendMessages: false
                });

                if (serverEventsVC.members.size > 0) {
                    serverEventsVC.members.each(async (member) => {
                        await member.voice.disconnect();
                    });
                }

                await interaction.reply({ content: `Closed up the ${serverEventsVC} (all members disconnected) and ${streamChat} channels for the <@&${serverEventsRole}> role. Hope you had fun! <:bITFWave:1022548691988512778>`, allowedMentions: { parse: [] } });
                break;
            case "fortnite_custom": // (Fortnite Customs role) Disable permissions for Server Events, Customs Chat, and Stream Chat
                await serverEventsVC.permissionOverwrites.edit(fortniteCustomsRole, {
                    ViewChannel: false,
                    Connect: false
                });

                await customsCodeChat.permissionOverwrites.edit(fortniteCustomsRole, {
                    ViewChannel: false
                });

                await streamChat.permissionOverwrites.edit(fortniteCustomsRole, {
                    ViewChannel: false,
                    SendMessages: false
                });

                if (serverEventsVC.members.size > 0) {
                    serverEventsVC.members.each(async (member) => {
                        await member.voice.disconnect();
                    });
                }

                await interaction.reply({ content: `Closed up the ${serverEventsVC} (all members disconnected), ${customsCodeChat}, and ${streamChat} channels for the <@&${fortniteCustomsRole}> role. Hope you had fun! <:bITFWave:1022548691988512778>`, allowedMentions: { parse: [] } });
                break;
            case "discord_movie": // (Discord Streams role) Disable permissions for Discord Movies and Stream Chat
                await movieEventsVC.permissionOverwrites.edit(discordStreamsRole, {
                    ViewChannel: false,
                    Connect: false
                });

                await streamChat.permissionOverwrites.edit(discordStreamsRole, {
                    ViewChannel: false,
                    SendMessages: false
                });

                if (movieEventsVC.members.size > 0) {
                    movieEventsVC.members.each(async (member) => {
                        await member.voice.disconnect();
                    });
                }

                await interaction.reply({ content: `Closed up the ${movieEventsVC} (all members disconnected) and ${streamChat} channels for the <@&${discordStreamsRole}> role. Hope you had fun! <:bITFWave:1022548691988512778>`, allowedMentions: { parse: [] } });
                break;
            default:
                break;
        }
    },
};