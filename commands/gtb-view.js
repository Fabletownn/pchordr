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
        let viewArray = [];
        let roundCounter = 1;
        let currEmbed;
        
        for (const [round, roundInfo] of gtbMap) {
            const roundAnswer = roundInfo[0];
            const roundImageURL = roundInfo[1];
            const roundPrompt = roundInfo[2];
            
            // If the amount of rounds have reached 10, reset the counter to 1 and create a new embed
            if (roundCounter >= 10) roundCounter = 1;

            // When the counter has been reset to 1, create a new embed (should be per 10 rounds)
            if (roundCounter === 1) {
                let newEmbed = new EmbedBuilder()
                    .setAuthor({ name: 'Guess The Blank Answers', iconURL: interaction.guild.iconURL({ size: 512, dynamic: true }) })
                    .setColor('#C51BDF');
                
                // Set the current embed variable to the embed we just created
                currEmbed = newEmbed;
                viewArray.push(newEmbed);
            }

            await currEmbed.addFields([
                { name: `Round ${round}`, value: `*${roundPrompt}*\n**[${roundAnswer}](${roundImageURL})**`, inline: true }
            ]);
            
            roundCounter++;
        }

        await interaction.reply({ embeds: [viewArray] });
    },
};