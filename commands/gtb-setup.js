const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GTB = require('../models/gtb.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-setup')
        .setDescription('Guess The Blank: Set up or reset rounds for the game')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const gtbData = await GTB.findOne({ guildID: interaction.guild.id });

        const confirmRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('gtb-reset')
                    .setEmoji('1022548599697051790')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('gtb-reset-no')
                    .setEmoji('1022548597390180382')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({ content: `Are you sure you would like to ${gtbData ? 'reset' : 'set up'} Guess The Blank round information?`, components: [confirmRow] });
    },
};