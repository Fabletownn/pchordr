const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');
const SCHEDULE = require('../models/schedules.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule-view')
        .setDescription('Showcases all current scheduled messages')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        let currentSchedules = [];

        SCHEDULE.findOne({
            guildID: interaction.guild.id
        }, async (err, data) => {
            if (err) return console.log(err);
            if (!data) return interaction.reply({ content: `There are no scheduled messages to display.` });

            console.log(data)
            console.log(data.length);

            if (data) {
                for (var i = 0; i < data.length; i++) {
                    if (!(currentSchedules.some((v) => data[i].scheduleID.includes(v)))) {
                        console.log('includes')

                        let sayMsg;
    
                        if (data[i].sayMessage.length > 20) sayMsg = `${data[i].sayMessage.slice(0, 20)}...`;
                        if (data[i].sayMessage.length < 20) sayMsg = data[i].sayMessage;
    
                        currentSchedules.push(`**${data[i].scheduleID}** | <#${data[i].sayChannel}>: ${sayMsg}\n`);
                    }
                }
            }

            await interaction.reply({ content: `All scheduled messages have been listed below.\n\n${currentSchedules || 'None'}\n\nTo delete a scheduled message, use the \`/schedule-remove\` command.\nTo schedule a message, use the \`/schedule\` command.` });

        });
    }
}