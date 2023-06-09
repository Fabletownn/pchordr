const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('break')
        .setDescription('Removes your staff role if you need to take a break from moderation')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('reason')
                .setDescription('Optional parameter requesting a reason for your break')
                .setRequired(false)
        ),

    async execute(interaction) {

        let reason = `(no reason specified)`;
        if (interaction.options.getString('reason')) reason = interaction.options.getString('reason');

        if (!interaction.member.roles.cache.has('993341600778436618')) return interaction.reply({ content: `Failed to put you on a break. You are either already on break, or not a staff member. <:bITFSweat:1022548683176284281>`, ephemeral: true });

        if (interaction.member.roles.cache.has('993341640758538312')) {

            await interaction.guild.member.roles.remove('614196214078111745').then(async () => {

                await interaction.member.roles.remove('614195872347062273')
                await interaction.member.roles.add('991785406028845199');

                await interaction.reply({ content: `${interaction.user} (Administrator) has just taken a break. Reason: **${reason}**` });

            });

        } else if (interaction.member.roles.cache.has('993341600778436618')) {

            await interaction.member.roles.remove('993341600778436618').then(async () => {

                await interaction.member.roles.add('991785406028845199');

                await interaction.reply({ content: `${interaction.user} (Moderator) has just taken a break. Reason: **${reason}**` });

            });

        } else {

            return;

        }

    },

};