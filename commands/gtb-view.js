const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const GTB = require('../models/gtb.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-view')
        .setDescription('Guess The Blank: View all round information')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
        if (!gtbData) return interaction.reply({ content: 'There is no Guess The Blank data set up yet. Run the `/gtb-setup` command to get started.' });
        if (gtbData.rounds.size <= 0) return interaction.reply({ content: 'There are no Guess The Blank rounds set up yet. Run the `/gtb-add` command to get started.' });

        const gtbMap = gtbData.rounds;
        const gtbEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Guess The Blank Answers', iconURL: interaction.guild.iconURL({ size: 512, dynamic: true }) })
            .setColor('#C51BDF');

        for (const [round, roundInfo] of gtbMap) {
            const roundAnswer = roundInfo[0];
            const roundImageURL = roundInfo[1];

            await gtbEmbed.addFields([
                { name: `Round ${round}`, value: `**[${roundAnswer}](${roundImageURL})**`, inline: true }
            ]);
        }

        await interaction.reply({ embeds: [gtbEmbed] });
    },
};