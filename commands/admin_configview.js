const CONFIG = require('../models/config.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    AllowedMentionsTypes,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-view')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Views the server\'s configuration settings')
        .setDMPermission(false),

    async execute(interaction) {

        CONFIG.findOne({

            guildID: interaction.guild.id,

        }, async (err, data) => {

            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not view configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });

            if (!data) return interaction.reply({ content: 'Could not view configuration values since data hasn\'t been set up yet. Use the `/config-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            let autopublishSetting;
            let vxTwitterSetting;
            let artSetting;
            let greetingSetting;

            if (data.autopublish === true) autopublishSetting = 'Enabled';
            if (data.autopublish === false) autopublishSetting = 'Disabled';

            if (data.vxtwitter === true) vxTwitterSetting = 'Enabled';
            if (data.vxtwitter === false) vxTwitterSetting = 'Disabled';

            if (data.artdelete === true) artSetting = 'Enabled';
            if (data.artdelete === false) artSetting = 'Disabled';

            if (data.greeting === true) greetingSetting = 'Enabled';
            if (data.greeting === false) greetingSetting = 'Disabled';

            const configEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Configuration Settings', iconURL: interaction.guild.iconURL({ dynamic: true })})
                .addFields([
                    { name: `Mod Chat ID`, value: `<#${data.modChat || 'None'}>`, inline: true },
                    { name: `Server Updates ID`, value: `<#${data.serverUpdatesChat || 'None'}>`, inline: true },
                    { name: `Polls ID`, value: `<#${data.pollsChat || 'None'}>`, inline: true },
                    { name: `Art ID`, value: `<#${data.artChat || 'None'}>`, inline: true },
                    { name: `Game Photography ID`, value: `<#${data.gpChat || 'None'}>`, inline: true },
                    { name: `Supporters Chat ID`, value: `<#${data.supportersChat || 'None'}>`, inline: true },
                    { name: `GTB Chat ID`, value: `<#${data.gtbChat || 'None'}>`, inline: true },
                    { name: `Administrator Role ID`, value: `<@&${data.adminRole || 'None'}>`, inline: true },
                    { name: `Moderator Role ID`, value: `<@&${data.modRole || 'None'}>`, inline: true },
                    { name: `Supporters Role ID`, value: `<@&${data.supportersRole || 'None'}>`, inline: true },
                    { name: `Booster Role ID`, value: `<@&${data.boosterRole || 'None'}>`, inline: true },
                    { name: `YouTube Member Role ID`, value: `<@&${data.ytRole || 'None'}>`, inline: true },
                    { name: `Twitch Subscriber Role ID`, value: `<@&${data.twitchRole || 'None'}>`, inline: true },
                    { name: `GTB Champion Role ID`, value: `<@&${data.gtbRole || 'None'}>`, inline: true },
                    { name: `\u200b`, value: `\u200b`, inline: true },
                    { name: `\u200b`, value: `\u200b`, inline: false },
                    { name: `Autopublishing`, value: autopublishSetting, inline: true},
                    { name: `VXTwitter`, value: vxTwitterSetting, inline: true},
                    { name: `Non-Art Deletion`, value: artSetting, inline: true},
                    { name: `Greeting Reaction`, value: greetingSetting, inline: true}
                ]);

            await interaction.reply({ embeds: [configEmbed] });

        });

    },

};