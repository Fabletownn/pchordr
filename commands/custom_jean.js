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
            files: ['https://cdn.discordapp.com/attachments/793551827076513822/1215750578114793542/GOBACKTOMODDING.png?ex=65fde2f5&is=65eb6df5&hm=97209523d23d259f3f9bfab7388852690dbb5a33ac7a715a5e1a1680352950ac&']
        });
    },
};