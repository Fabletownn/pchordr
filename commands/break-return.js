const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');
const CONFIG = require('../models/config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('break-return')
        .setDescription('Adds your staff roles if returning from a break')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),
    async execute(interaction) {
        CONFIG.findOne({
            guildID: interaction.guild.id
        }, async (err, data) => {
            if (err) return console.log(err);
            if (!data) return interaction.reply({ content: `Failed to return. Ask an Admin to set configuration back up.` });

            if (!interaction.member.roles.cache.has('1019684924372045947')) return interaction.editReply({ content: `Failed to return, you are not on break.`, ephemeral: false });

            if (interaction.member.roles.cache.has('1019684924372045947')) {
                await interaction.member.roles.remove('1019684924372045947').then(async () => {
                    await interaction.member.roles.add(data.modRole);

                    await interaction.guild.channels.cache.get(data.modChat).send({ content: `${interaction.user} has **returned from their break**. Welcome back!`, ephemeral: true });

                    await interaction.reply({ content: `Successfully returned. Welcome back!`, ephemeral: true });
                });
            }
        });
    },
};