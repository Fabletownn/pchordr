const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const CONFIG = require('../models/config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('break')
        .setDescription('Removes your staff role if you need to take a break from moderation')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('reason')
                .setDescription('Optional parameter requesting a reason for your break')
                .setRequired(false)
        ),
    async execute(interaction) {
        CONFIG.findOne({
            guildID: interaction.guild.id
        }, async (err, data) => {
            if (err) return console.log(err);
            if (!data) return interaction.reply({ content: 'Failed to go on a break! Ask an Admin to complete configuration.' });

            let reason = `(no reason specified)`;
            if (interaction.options.getString('reason')) reason = interaction.options.getString('reason');

            if (!interaction.member.roles.cache.has(data.modRole)) return interaction.reply({ content: 'Failed to put you on a break. You are either already on break, or not a staff member. <:bITFSweat:1022548683176284281>', ephemeral: true });

            if (interaction.member.roles.cache.has(data.adminRole)) {
                await interaction.member.roles.remove(data.modRole).then(async () => {
                    await interaction.member.roles.remove(data.adminRole);
                    await interaction.member.roles.add('1019684924372045947');

                    await interaction.guild.channels.cache.get(data.modChat).send({ content: `${interaction.user} (Administrator) has just taken a break. Reason: **${reason}**` });

                    await interaction.reply({ content: `Successfully went on break.`, ephemeral: true });
                });
            } else if (interaction.member.roles.cache.has(data.modRole)) {
                await interaction.member.roles.remove(data.modRole).then(async () => {
                    await interaction.member.roles.add('1019684924372045947');

                    await interaction.guild.channels.cache.get(data.modChat).send({ content: `${interaction.user} (Moderator) has just taken a break. Reason: **${reason}**` });

                    await interaction.reply({ content: `Successfully went on break.`, ephemeral: true });
                });
            }
        });
    },
};