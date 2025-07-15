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
        
        await interaction.deferReply();
        
        const gtbMap = gtbData.rounds;
        let viewArray = [];
        let roundCounter = 0;
        let currEmbed;
        
        for (const [round, roundInfo] of gtbMap) {
            const roundAnswer = roundInfo[0];
            const roundImageURL = roundInfo[1];
            const roundPrompt = roundInfo[2];

            // When the counter has been reset to 1, create a new embed and set it to current (should be per 10 rounds)
            if (roundCounter % 10 === 0) {
                let startingRound = roundCounter + 1; // Add 1 to the current index as it starts with 0
                let shouldEndingRound = roundCounter + 10; // The estimated rounds that expect 10 more - checked by endingRound
                let endingRound = (gtbMap.size >= shouldEndingRound) ? shouldEndingRound : gtbMap.size; // If there aren't 10 more rounds, set it to the size of the number of rounds
                let formattedRounds = (startingRound !== endingRound) ? `Rounds ${startingRound} - ${endingRound}` : `Round ${endingRound}`; // If there's just 1 round left (e.g. 31), display 31 instead of something like 31 - 31
                
                currEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Guess The Blank: ${formattedRounds}`, iconURL: interaction.guild.iconURL({ size: 512, dynamic: true }) })
                    .setColor('#C51BDF');
                
                // Set the current embed variable to the embed we just created
                viewArray.push(currEmbed);
            }

            currEmbed.addFields([
                { name: `Round ${round}`, value: `*${roundPrompt}*\n**[${roundAnswer}](${roundImageURL})**`, inline: true }
            ]);
            
            roundCounter++;
        }
        
        // Split each embed into 2 embeds per message and send them
        const embedLimit = 2;
        
        for (let i = 0; i < viewArray.length; i += embedLimit) {
            const embedChunk = viewArray.slice(i, i + embedLimit);
            
            if (i === 0)
                await interaction.followUp({ embeds: embedChunk });
            else 
                await interaction.channel.send({ embeds: embedChunk });
        }
    },
};