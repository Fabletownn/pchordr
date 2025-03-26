const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const GTB = require('../models/gtb.js');
const { endGame } = require('../handlers/gtb_functions.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-end')
        .setDescription('Guess The Blank: Forcefully end the ongoing game')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
        if (!gtbData) return interaction.reply({ content: 'There is no Guess The Blank data set up yet. Run the `/gtb-setup` command to get started.' });

        await endGame(interaction);
        await interaction.reply({ content: 'Forcefully ended the ongoing Guess The Blank game.', ephemeral: true });
    },
};
