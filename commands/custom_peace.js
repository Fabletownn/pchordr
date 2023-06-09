const {
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('peace-and-love')
        .setDescription('Peace and love, peace and love!')
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.reply({

            content: `Peace & love!`,

            files: ['https://cdn.discordapp.com/attachments/615594300108963867/923285735874916382/image.png']

        });

    },

};