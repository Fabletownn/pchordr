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

            files: ['https://cdn.discordapp.com/attachments/615594300108963867/690975569482874941/image.png']

        });

    },

};