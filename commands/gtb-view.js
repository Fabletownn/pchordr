const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const GTB = require('../models/gtb.js');
const CONFIG = require('../models/config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-view')
        .setDescription('Guess The Blank: View all round information')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
        const configData = await CONFIG.findOne({ guildID: interaction.guild.id });
        
        if (!gtbData) return interaction.reply({ content: 'There is no Guess The Blank data set up yet. Run the `/gtb-setup` command to get started.' });
        if (!configData) return interaction.reply({ content: 'There is no configuration data set up yet. Run the `/setup` command to get started.' });
        if (gtbData.rounds.size <= 0) return interaction.reply({ content: 'There are no Guess The Blank rounds set up yet. Run the `/gtb-add` command to get started.' });
        if (interaction.channel.id === configData.gtbChat) return interaction.reply({ content: 'You cannot use that command here! Run it in a private channel.', ephemeral: true });
        
        const gtbMap = gtbData.rounds;
        const gtbEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Guess The Blank Answers', iconURL: interaction.guild.iconURL({ size: 512, dynamic: true }) })
            .setColor('#C51BDF');
        const overloadEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Guess The Blank Answers', iconURL: interaction.guild.iconURL({ size: 512, dynamic: true }) })
            .setColor('#C51BDF');

        let roundCounter = 1;
        
        for (const [round, roundInfo] of gtbMap) {
            const roundAnswer = roundInfo[0];
            const roundImageURL = roundInfo[1];
            const roundPrompt = roundInfo[2];
            
            if (roundCounter < 25) {
                await gtbEmbed.addFields([
                    { name: `Round ${round}`, value: `*${roundPrompt}* **[${roundAnswer}](${roundImageURL})**`, inline: true }
                ]);
            } else {
                await overloadEmbed.addFields([
                    { name: `Round ${round}`, value: `*${roundPrompt}* **[${roundAnswer}](${roundImageURL})**`, inline: true }
                ]);
            }
            
            roundCounter++;
        }

        if (roundCounter > 25)
            await interaction.reply({ embeds: [gtbEmbed, overloadEmbed] });
        else 
            await interaction.reply({ embeds: [gtbEmbed] });
    },
};