const {
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jean')
        .setDescription('Jenna, go back to modding!')
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.reply({
            content: 'Jenna go back to modding!',
            files: ['https://i.imgur.com/hTyPGgG.png']
        });
    },
};