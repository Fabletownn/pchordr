const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule-message')
        .setDescription('Schedules a message or announcement to send (interactive)')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const scheduleModal = new ModalBuilder()
            .setCustomId('schedule-msg')
            .setTitle('Schedule Message')
            .addComponents([
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('schedule-date')
                        .setLabel('Scheduled Date')
                        .setPlaceholder('MM/DD')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('schedule-time')
                        .setLabel('Scheduled Time')
                        .setPlaceholder('00:00 PM/AM (UTC)')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('schedule-message')
                        .setLabel('Scheduled Message')
                        .setPlaceholder('Message to be announced here..')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('schedule-attachment')
                        .setLabel('Attachment URL')
                        .setPlaceholder('https://cdn.discordapp.com/image-url-here/')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                ),
            ]);

        await interaction.showModal(scheduleModal);
    }
}