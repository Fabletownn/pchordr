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
            content: 'Peace & love!',
            files: ['https://cdn.discordapp.com/attachments/793551827076513822/1215750790170411038/pal.png?ex=65fde327&is=65eb6e27&hm=4a6ac9a34b6fd8ad45e630b0e5be3afec0ad80d002f9abda0e3150f294091466&']
        });
    },
};