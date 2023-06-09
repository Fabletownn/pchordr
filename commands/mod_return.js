const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('return')
        .setDescription('Adds your staff roles if returning from a break')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),

    async execute(interaction) {

        if (!interaction.member.roles.cache.has('1019684924372045947')) return interaction.editReply({ content: `<:pcErrorT:1091446147811397712> Could not return. User is either already staff member, stepped down (Alumni), or not previous staff member.`, ephemeral: false });

        if (interaction.member.roles.cache.has('1019684924372045947')) {

            await interaction.member.roles.remove('1019684924372045947').then(async () => {

                await interaction.member.roles.add('614196214078111745');

                await interaction.reply({ content: `${interaction.user} is **back from break**. Welcome back!`, ephemeral: true });

            });

        } else {

            return;

        }

    },

};