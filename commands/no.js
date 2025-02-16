const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('no')
        .setDescription('No.'),
    async execute(interaction) {
        await interaction.reply({
            files: ['https://i.imgur.com/ssTdHnI.jpeg']
        });
    },
};