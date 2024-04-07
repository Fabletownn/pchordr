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
            files: ['https://cdn.discordapp.com/attachments/793551827076513822/1215748703718211655/5toe6l5kqh231_1.jpg?ex=65fde136&is=65eb6c36&hm=9513bdd5eec5429a6b09c7948a65e93e97f1132721f3d348fb51439141eb9387&']
        });
    },
};