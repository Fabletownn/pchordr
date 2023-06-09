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

            content: `Jenna go back to modding!`,

            files: ['https://cdn.discordapp.com/attachments/615594300108963867/985173994556784650/image.png']

        });

    },

};