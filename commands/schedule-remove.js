const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const SCHEDULE = require('../models/schedules.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule-remove')
        .setDescription('Removes a scheduled message from being posted')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('schedule-id')
            .setDescription('What is the scheduled message\'s ID?')
            .setRequired(true)
        ),
    async execute(interaction) {
        const schedID = interaction.options.getString('schedule-id');

        SCHEDULE.findOne({
            guildID: interaction.guild.id,
            scheduleID: schedID
        }, async (err, data) => {
            if (err) return console.log(err);
            if (!data) return interaction.reply({ content: `Failed to remove that scheduled message, as there is no message with that ID.\n\nTo view all current scheduled messages, use the \`/schedule-view\` command.` });

            await data.delete();
            await interaction.reply({ content: `Removed the scheduled message with the ID **${schedID}**, and it will no longer send.` });
        });
    }
}