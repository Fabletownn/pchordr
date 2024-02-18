const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event launch')
        .setDescription('Unlocks specific channels and parts of the server for Server Events')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('event')
                .setDescription('What event should be started?')
                .setRequired(true)
                .addChoices({
                    name: 'Discord Stream',
                    value: 'discord_stream'
                }, {
                    name: 'Server Event',
                    value: 'server_event'
                }, {
                    name: 'Fortnite Custom',
                    value: 'fortnite_custom'
                },
                )
        ),

    async execute(interaction) {

        const to_launch = interaction.options.get('event').value;

        switch (to_launch) {

            case "discord_stream":

                let serverEventsDS = interaction.guild.channels.cache.get('815790709646163968');
                let discordStreamsDS = interaction.guild.channels.cache.get('973751203756400660');

                serverEventsDS.permissionOverwrites.edit(interaction.guild.id, {

                    ViewChannel: true,

                });

                discordStreamsDS.permissionOverwrites.edit(interaction.guild.id, {

                    ViewChannel: true,

                }).then(async () => {

                    await interaction.reply(`Unlocked the <#815790709646163968> & <#973751203756400660> channels for all members. <:bITFVictory:1063265610303295619>`);

                });

                break;

            case "server_event":

                let serverEventsSE = interaction.guild.channels.cache.get('815790709646163968');
                let eventsChatSE = interaction.guild.channels.cache.get('973751203756400660');
                let customsChatSE = interaction.guild.channels.cache.get('771394751316099133');

                serverEventsSE.permissionOverwrites.edit('731212776936308777', {

                    ViewChannel: true,

                });

                customsChatSE.permissionOverwrites.edit('731212776936308777', {

                    ViewChannel: true,

                });

                eventsChatSE.permissionOverwrites.edit('731212776936308777', {

                    ViewChannel: true,

                }).then(async () => {

                    await interaction.reply(`Unlocked the <#815790709646163968>, <#973751203756400660> & <#771394751316099133> channels for the 'Server Events' role. <:bITFVictory:1063265610303295619>`);

                });

                break;

            case "fortnite_custom":

                let serverEventsFC = interaction.guild.channels.cache.get('815790709646163968');
                let eventsChatFC = interaction.guild.channels.cache.get('973751203756400660');
                let customsChatFC = interaction.guild.channels.cache.get('771394751316099133');

                serverEventsFC.permissionOverwrites.edit('731217324765479053', {

                    ViewChannel: true,

                });

                customsChatFC.permissionOverwrites.edit('731217324765479053', {

                    ViewChannel: true,

                });

                eventsChatFC.permissionOverwrites.edit('731217324765479053', {

                    ViewChannel: true,

                }).then(async () => {

                    await interaction.reply(`Unlocked the <#815790709646163968>, <#973751203756400660> & <#771394751316099133> channels for the 'Fortnite Customs' role. <:bITFVictory:1063265610303295619>`);

                });

                break;

            default:
                break;
        }

    },

};