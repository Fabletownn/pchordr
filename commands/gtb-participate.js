const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const CONFIG = require('../models/config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-participate')
        .setDescription('Removes your Guess The Blank Champion role to be able to participate in games'),
    async execute(interaction) {
        const configData = await CONFIG.findOne({ guildID: interaction.guild.id });
        if (!configData) return interaction.reply({ content: 'This command is not yet ready, please try again later or contact an Administrator if this continues.', ephemeral: true });
        
        const isChampion = interaction.member.roles.cache.has(configData.gtbRole);
        const canParticipateString = isChampion ? 'You are not eligible to earn points in Guess The Blank' : 'You are eligible to earn points in Guess The Blank';
        const participationInfoString = isChampion ? 'To earn points, you will need to remove this role. Doing so means you will have to earn it back in future games. Are you sure you want to remove it? <:bITFSweat:1022548683176284281>' :
                                                             'You are able to participate in future games. You can earn the champion role by earning **3 points** or more in hosted games. <:bITFGG:1022548636481114172>';
        const confirmRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('gtbrole-yes')
                    .setEmoji('1022548599697051790')
                    .setLabel('Remove Champion Role')
                    .setStyle(ButtonStyle.Danger)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('gtbrole-no')
                    .setEmoji('1022548597390180382')
                    .setLabel('Nevermind, Keep Champion Role')
                    .setStyle(ButtonStyle.Secondary)
            );
        
        await interaction.reply({
            content: `## ${canParticipateString}!\nPlayers with the <@&${configData.gtbRole}> role are not eligible to participate in Guess The Blank games.\n\n${participationInfoString}`,
            ephemeral: true,
            components: isChampion ? [confirmRow] : [],
            allowedMentions: []
        });
    },
};