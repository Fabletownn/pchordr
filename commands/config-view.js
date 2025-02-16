const CONFIG = require('../models/config.js');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-view')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Views the server\'s configuration settings'),
    async execute(interaction) {
        CONFIG.findOne({
            guildID: interaction.guild.id,
        }, async (err, data) => {
            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not view configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.reply({ content: 'Could not view configuration values since data hasn\'t been set up yet. Use the `/config-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            const channelEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Channel Configuration', iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    { name: `General`, value: `<#${data.generalChat || 'None'}>`, inline: true },
                    { name: `Giveaways`, value: `<#${data.giveawayChannel || 'None'}>`, inline: true },
                    { name: `Giveaway Winner`, value: `<#${data.giveawayWinnerChannel || 'None'}>`, inline: true },
                    { name: `Mod Chat`, value: `<#${data.modChat || 'None'}>`, inline: true },
                    { name: `Server Updates`, value: `<#${data.serverUpdatesChat || 'None'}>`, inline: true },
                    { name: `Polls`, value: `<#${data.pollsChat || 'None'}>`, inline: true },
                    { name: `Art`, value: `<#${data.artChat || 'None'}>`, inline: true },
                    { name: `Game Photography`, value: `<#${data.gpChat || 'None'}>`, inline: true },
                    { name: `Supporters`, value: `<#${data.supportersChat || 'None'}>`, inline: true },
                    { name: `Guess The Blank`, value: `<#${data.gtbChat || 'None'}>`, inline: true },
                );

            const roleEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Role Configuration', iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    { name: `Administrator`, value: ((data.adminRole !== null) ? `<@&${data.adminRole}>` : 'None'), inline: true },
                    { name: `Moderator`, value: ((data.modRole !== null) ? `<@&${data.modRole}>` : 'None'), inline: true },
                    { name: `Supporter`, value: ((data.supportersRole !== null) ? `<@&${data.supportersRole}>` : 'None'), inline: true },
                    { name: `Server Booster`, value: ((data.boosterRole !== null) ? `<@&${data.boosterRole}>` : 'None'), inline: true },
                    { name: `YouTube Member`, value: ((data.ytRole !== null) ? `<@&${data.ytRole}>` : 'None'), inline: true },
                    { name: `Twitch Subscriber`, value: ((data.twitchRole !== null) ? `<@&${data.twitchRole}>` : 'None'), inline: true },
                    { name: `Giveaway Winner`, value: ((data.giveawayWinnerRole !== null) ? `<@&${data.giveawayWinnerRole}>` : 'None'), inline: true },
                    { name: `Guess The Blank Champion`, value: ((data.gtbRole !== null) ? `<@&${data.gtbRole}>` : 'None'), inline: true },
                );

            const featureEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Trigger Configuration', iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(
                    { name: `Autopublishing`, value: ((data.autopublish === true) ? 'Enabled' : 'Disabled'), inline: true },
                    { name: `VXTwitter`, value: ((data.vxtwitter === true) ? 'Enabled' : 'Disabled'), inline: true },
                    { name: `Non-Art Deletion`, value: ((data.artdelete === true) ? 'Enabled' : 'Disabled'), inline: true },
                    { name: `General Chat Greeting`, value: ((data.greeting === true) ? 'Enabled' : 'Disabled'), inline: true },
                    { name: `Giveaway Winner Setup`, value: ((data.autogiveaway === true) ? 'Enabled' : 'Disabled'), inline: true }
                );

            await interaction.reply({ embeds: [channelEmbed, roleEmbed, featureEmbed] });
        });
    },
};