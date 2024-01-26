const CONFIG = require('../models/config.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-edit')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Edits configuration values of specific bot features')
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('config')
                .setDescription('What are you looking to change?')
                .addChoices({
                    name: 'Update Channel ID: General',
                    value: 'generalchat'
                }, {
                    name: 'Update Channel ID: Giveaway Channel',
                    value: 'giveawaychannel'
                }, {
                    name: 'Update Channel ID: Giveaway Winner Channel',
                    value: 'giveawaywinnerchannel'
                }, {
                    name: 'Update Channel ID: Mod Chat',
                    value: 'modchat'
                }, {
                    name: 'Update Channel ID: Server Updates',
                    value: 'serverupdateschat'
                }, {
                    name: 'Update Channel ID: Polls',
                    value: 'pollschat'
                }, {
                    name: 'Update Channel ID: Art',
                    value: 'artchat'
                }, {
                    name: 'Update Channel ID: Game Photography',
                    value: 'gpchat'
                }, {
                    name: 'Update Channel ID: Supporters',
                    value: 'supporterschat'
                }, {
                    name: 'Update Channel ID: Guess The Blank',
                    value: 'gtbchat'
                }, {
                    name: 'Update Role ID: Administrator',
                    value: 'adminrole'
                }, {
                    name: 'Update Role ID: Moderator',
                    value: 'modrole'
                }, {
                    name: 'Update Role ID: Supporters',
                    value: 'supportersrole'
                }, {
                    name: 'Update Role ID: Server Boosters',
                    value: 'boosterrole'
                }, {
                    name: 'Update Role ID: YouTube Members',
                    value: 'youtuberole'
                }, {
                    name: 'Update Role ID: Twitch Subscribers',
                    value: 'twitchrole'
                }, {
                    name: 'Update Role ID: Giveaway Winner',
                    value: 'giveawaywinnerrole'
                }, {
                    name: 'Update Role ID: Guess The Blank Champion',
                    value: 'gtbrole'
                }, {
                    name: 'Toggle Feature: Autopublishing',
                    value: 'autopublish'
                }, {
                    name: 'Toggle Feature: VXTwitter',
                    value: 'vxtwitter'
                }, {
                    name: 'Toggle Feature: Non-Art Deletion',
                    value: 'artdelete'
                }, {
                    name: 'Toggle Feature: General Greeting',
                    value: 'greeting'
                }, {
                    name: 'Toggle Feature: Giveaway Winners',
                    value: 'autogiveaway'
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('value')
                .setDescription('What do you wish to change the config value to? (e.g. on/off or ID)')
                .setRequired(true)
        ),

    async execute(interaction) {

        CONFIG.findOne({

            guildID: interaction.guild.id,

        }, async (err, data) => {

            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not handle configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });

            if (!data) return interaction.reply({ content: 'Could not configurate values since data hasn\'t been set up yet. Use the `/config-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            const configChoice = interaction.options.get('config').value;
            const configVal = interaction.options.getString('value').toLowerCase();

            switch (configChoice) {

                case "generalchat":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the General channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });
                    if (interaction.guild.channels.cache.get(configVal).type !== ChannelType.GuildText) return interaction.reply({ content: 'Failed to set that ID as the General channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>' });

                    if (data.generalChat === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.generalChat = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the General Chat channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "giveawaychannel":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Giveaway channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });

                    if (data.giveawayChannel === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.giveawayChannel = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Giveaway channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "giveawaywinnerchannel":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Giveaway Winner channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });

                    if (data.giveawayWinnerChannel === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.giveawayWinnerChannel = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Giveaway Winner channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "modchat":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Mod Chat channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });
                    if (interaction.guild.channels.cache.get(configVal).type !== ChannelType.GuildText) return interaction.reply({ content: 'Failed to set that ID as the Mod Chat channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>' });

                    if (data.modChat === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.modChat = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Mod Chat channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "serverupdateschat":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Server Updates channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });
                    if (interaction.guild.channels.cache.get(configVal).type !== ChannelType.GuildAnnouncement) return interaction.reply({ content: 'Failed to set that ID as the Server Updates channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>' });

                    if (data.serverUpdatesChat === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.serverUpdatesChat = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Server Updates channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "pollschat":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Polls channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });
                    if (interaction.guild.channels.cache.get(configVal).type !== ChannelType.GuildText) return interaction.reply({ content: 'Failed to set that ID as the Polls channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>' });

                    if (data.pollsChat === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.pollsChat = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Polls channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "artchat":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Art channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });
                    if (interaction.guild.channels.cache.get(configVal).type !== ChannelType.GuildText) return interaction.reply({ content: 'Failed to set that ID as the Art channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>' });

                    if (data.artChat === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.artChat = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Art channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "gpchat":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Game Photography channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });
                    if (interaction.guild.channels.cache.get(configVal).type !== ChannelType.GuildText) return interaction.reply({ content: 'Failed to set that ID as the Game Photography channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>' });

                    if (data.gpChat === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.gpChat = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Game Photography channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "supporterschat":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the supporters channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });
                    if (interaction.guild.channels.cache.get(configVal).type !== ChannelType.GuildText) return interaction.reply({ content: 'Failed to set that ID as the supporters channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>' });

                    if (data.supportersChat === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.supportersChat = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Supporters channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "gtbchat":

                    if (!interaction.guild.channels.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the GTB channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the channel\'s ID, not the mention.' });
                    if (interaction.guild.channels.cache.get(configVal).type !== ChannelType.GuildText) return interaction.reply({ content: 'Failed to set that ID as the GTB channel, as it does not exist or is not text-based. <:bITFSweat:1022548683176284281>' });

                    if (data.gtbChat === configVal) return interaction.reply({ content: 'That channel is already in use.' });

                    data.gtbChat = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the GTB channel to <#' + configVal + '>. <:bITFVictory:1063265610303295619>' });

                    break;

                case "adminrole":

                    if (!interaction.guild.roles.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Administrator role, as it does not exist or not found. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the role\'s ID, not the mention.' });

                    if (data.adminRole === configVal) return interaction.reply({ content: 'That role is already in use.' });

                    data.adminRole = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Administrator role to <@&' + configVal + '>. <:bITFVictory:1063265610303295619>', allowedMentions: { parse: [] } });

                    break;

                case "modrole":

                    if (!interaction.guild.roles.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Moderator role, as it does not exist or not found. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the role\'s ID, not the mention.' });

                    if (data.modRole === configVal) return interaction.reply({ content: 'That role is already in use.' });

                    data.modRole = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Moderator role to <@&' + configVal + '>. <:bITFVictory:1063265610303295619>', allowedMentions: { parse: [] } });

                    break;

                case "supportersrole":

                    if (!interaction.guild.roles.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Supporters role, as it does not exist or not found. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the role\'s ID, not the mention.' });

                    if (data.supportersRole === configVal) return interaction.reply({ content: 'That role is already in use.' });

                    data.supportersRole = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Supporters role to <@&' + configVal + '>. <:bITFVictory:1063265610303295619>', allowedMentions: { parse: [] } });

                    break;

                case "boosterrole":

                    if (!interaction.guild.roles.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Server Booster role, as it does not exist or not found. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the role\'s ID, not the mention.' });

                    if (data.boosterRole === configVal) return interaction.reply({ content: 'That role is already in use.' });

                    data.boosterRole = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Server Booster role to <@&' + configVal + '>. <:bITFVictory:1063265610303295619>', allowedMentions: { parse: [] } });

                    break;

                case "youtuberole":

                    if (!interaction.guild.roles.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the YouTube Member role, as it does not exist or not found. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the role\'s ID, not the mention.' });

                    if (data.ytRole === configVal) return interaction.reply({ content: 'That role is already in use.' });

                    data.ytRole = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the YouTube Member role to <@&' + configVal + '>. <:bITFVictory:1063265610303295619>', allowedMentions: { parse: [] } });

                    break;

                case "twitchrole":

                    if (!interaction.guild.roles.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Twitch Subscriber role, as it does not exist or not found. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the role\'s ID, not the mention.' });

                    if (data.twitchRole === configVal) return interaction.reply({ content: 'That role is already in use.' });

                    data.twitchRole = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Twitch Subscriber role to <@&' + configVal + '>. <:bITFVictory:1063265610303295619>', allowedMentions: { parse: [] } });

                    break;

                case "gtbrole":

                    if (!interaction.guild.roles.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the GTB Champion role, as it does not exist or not found. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the role\'s ID, not the mention.' });

                    if (data.gtbRole === configVal) return interaction.reply({ content: 'That role is already in use.' });

                    data.gtbRole = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the GTB Champion role to <@&' + configVal + '>. <:bITFVictory:1063265610303295619>', allowedMentions: { parse: [] } });

                    break;

                case "giveawaywinnerrole":

                    if (!interaction.guild.roles.cache.get(configVal)) return interaction.reply({ content: 'Failed to set that ID as the Giveaway Winner role, as it does not exist or not found. <:bITFSweat:1022548683176284281>\n\nThis parameter requires you to provide the role\'s ID, not the mention.' });

                    if (data.giveawayWinnerRole === configVal) return interaction.reply({ content: 'That role is already in use.' });

                    data.giveawayWinnerRole = configVal;
                    data.save().catch((err) => console.log(err));

                    await interaction.reply({ content: 'Set the Giveaway Winner role to <@&' + configVal + '>. <:bITFVictory:1063265610303295619>', allowedMentions: { parse: [] } });

                    break;

                case "autopublish":

                    if ((configVal !== 'off' && configVal !== 'false' && configVal !== 'on' && configVal !== 'true')) return interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors).' });

                    if (configVal === 'true' || configVal === 'on') {

                        if (data.autopublish === true) return interaction.reply({ content: 'Autopublishing is already enabled.' });

                        data.autopublish = true;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: 'Enabled autopublishing in announcement channels. <:bITFVictory:1063265610303295619>' });

                    } else if (configVal === 'false' || configVal === 'off') {

                        if (data.autopublish === false) return interaction.reply({ content: 'Autopublishing is already disabled.' });

                        data.autopublish = false;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: 'Disabled autopublishing from announcement channels. <:bITFVictory:1063265610303295619>' });

                    } else {

                        await interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors). <:bITFSweat:1022548683176284281>' });

                    }

                    break;

                case "vxtwitter":

                    if ((configVal !== 'off' && configVal !== 'false' && configVal !== 'on' && configVal !== 'true')) return interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors).' });
                    if (data.modChat === null) return interaction.reply({ content: 'Failed to set that as it is dependent on other value(s). Ensure the Mod Chat channel is set before updating this one.' });

                    if (configVal === 'true' || configVal === 'on') {

                        if (data.vxtwitter === true) return interaction.reply({ content: 'The VXTwitter trigger is already enabled.' });

                        data.vxtwitter = true;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: 'Enabled VXTwitter in <#' + data.modChat + '>. <:bITFVictory:1063265610303295619>' });

                    } else if (configVal === 'false' || configVal === 'off') {

                        if (data.vxtwitter === false) return interaction.reply({ content: 'The VXTwitter trigger is already disabled.' });

                        data.vxtwitter = false;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: 'Disabled VXTwitter from <#' + data.modChat + '>. <:bITFVictory:1063265610303295619>' });

                    } else {

                        await interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors). <:bITFSweat:1022548683176284281>' });

                    }

                    break;

                case "artdelete":

                    if ((configVal !== 'off' && configVal !== 'false' && configVal !== 'on' && configVal !== 'true')) return interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors).' });
                    if ((data.artChat === null) || (data.gpChat === null) || (data.modRole === null)) return interaction.reply({ content: 'Failed to set that as it is dependent on other value(s). Ensure **both** the Art/Game Photography channels and Moderator roles are set before updating this one.' });

                    if (configVal === 'true' || configVal === 'on') {

                        if (data.artdelete === true) return interaction.reply({ content: 'The Art Deletion trigger is already enabled.' });

                        data.artdelete = true;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: 'Enabled Art Deletion in the art channels. <:bITFVictory:1063265610303295619>' });

                    } else if (configVal === 'false' || configVal === 'off') {

                        if (data.artdelete === false) return interaction.reply({ content: 'The Art Deletion trigger is already disabled.' });

                        data.artdelete = false;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: 'Disabled Art Deletion from the art channels. <:bITFVictory:1063265610303295619>' });

                    } else {

                        await interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors). <:bITFSweat:1022548683176284281>' });

                    }

                    break;

                case "greeting":

                    if ((configVal !== 'off' && configVal !== 'false' && configVal !== 'on' && configVal !== 'true')) return interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors).' });
                    if (data.generalChat === null) return interaction.reply({ content: 'Failed to set that as it is dependent on other value(s). Ensure the General channel is set before updating this one.' });

                    if (configVal === 'true' || configVal === 'on') {

                        if (data.greeting === true) return interaction.reply({ content: 'The greeting trigger is already enabled.' });

                        data.greeting = true;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: `Enabled greeting in the <#${data.generalChat}> channel. <:bITFVictory:1063265610303295619>` });

                    } else if (configVal === 'false' || configVal === 'off') {

                        if (data.greeting === false) return interaction.reply({ content: 'The greeting trigger is already disabled.' });

                        data.greeting = false;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: `Disabled greeting in the <#${data.generalChat}> channel. <:bITFVictory:1063265610303295619>` });

                    } else {

                        await interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors). <:bITFSweat:1022548683176284281>' });

                    }

                    break;

                case "autogiveaway":

                    if ((configVal !== 'off' && configVal !== 'false' && configVal !== 'on' && configVal !== 'true')) return interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors).' });
                    if (data.giveawayChannel === null || data.modChat === null) return interaction.reply({ content: 'Failed to set that as it is dependent on other value(s). Ensure the Giveaway & ModChat channel is set before updating this one.' });

                    if (configVal === 'true' || configVal === 'on') {

                        if (data.autogiveaway === true) return interaction.reply({ content: 'The automatic giveaway winner trigger is already enabled.' });

                        data.autogiveaway = true;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: `Enabled the automatic giveaway winner trigger in the <#${data.giveawayChannel}> channel. <:bITFVictory:1063265610303295619>` });

                    } else if (configVal === 'false' || configVal === 'off') {

                        if (data.autogiveaway === false) return interaction.reply({ content: 'The automatic giveaway winner trigger is already disabled.' });

                        data.autogiveaway = false;
                        data.save().catch((err) => console.log(err));

                        await interaction.reply({ content: `Disabled the automatic giveaway winner in the <#${data.giveawayChannel}> channel. <:bITFVictory:1063265610303295619>` });

                    } else {

                        await interaction.reply({ content: 'Failed to set that value. Unknown parameter was given (only accepts true/false or on/off factors). <:bITFSweat:1022548683176284281>' });

                    }

                    break;

                default:

                    break;

            }

        });

    },

};