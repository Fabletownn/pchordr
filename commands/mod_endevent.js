const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-end')
        .setDescription('Ends all ongoing Server Events, if any')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        const serverEvents = interaction.guild.channels.cache.get('815790709646163968');
        const eventsChat = interaction.guild.channels.cache.get('973751203756400660');
        const codesChan = interaction.guild.channels.cache.get('771394751316099133');

        await serverEvents.permissionOverwrites.edit(interaction.guild.id, {
            
            ViewChannel: false,

        }, `@${interaction.user.username} has requested the event to end`);

        await eventsChat.permissionOverwrites.edit(interaction.guild.id, {

            ViewChannel: false,

        }, `@${interaction.user.username} has requested the event to end`);

        await serverEvents.permissionOverwrites.edit('731212776936308777', {

            ViewChannel: false,

        }, `@${interaction.user.username} has requested the event to end`);

        await eventsChat.permissionOverwrites.edit('731212776936308777', {

            ViewChannel: false,

        }, `@${interaction.user.username} has requested the event to end`);

        await serverEvents.permissionOverwrites.edit('731217324765479053', {

            ViewChannel: false,

        }, `@${interaction.user.username} has requested the event to end`);

        await eventsChat.permissionOverwrites.edit('731217324765479053', {

            ViewChannel: false,

        }, `@${interaction.user.username} has requested the event to end`);

        await codesChan.permissionOverwrites.edit('731217324765479053', {

            ViewChannel: false,

        }, `@${interaction.user.username} has requested the event to end`);

        await interaction.reply(`Closed down all Server Event voice & text channels for all members and roles. <:bITFVictory:1063265610303295619>`);

    },

};