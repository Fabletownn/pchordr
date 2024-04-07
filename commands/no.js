const {
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('no')
        .setDescription('No.')
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.reply({
            files: ['https://i.imgur.com/ssTdHnI.jpeg']
        });
    },
};