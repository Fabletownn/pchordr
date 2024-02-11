const CONFIG = require('../../models/config.js');

module.exports = async (Discord, oldMember, newMember) => {
    const guildID = newMember.guild.id;
    const guild = newMember.guild;

    if (newMember.user.bot) return;

    CONFIG.findOne({

        guildID: guildID

    }, (err, data) => {

        if (err) return console.log(err);
        if (!data) return;
        if (!data.supportersChannel) return console.log('No supporters channel!');
        if (!data.supportersRole) return console.log('No supporters role!');

        const supportersChannelID = data.supportersChannel;
        const supporterRoleID = data.supportersRole;

        const boosterRoleID = data.boosterRole;
        const twitchRoleID = data.twitchRole;
        const youtubeRoleID = data.ytRole;

        if ((boosterRoleID === null) || (twitchRoleID === null) || (youtubeRoleID === null) || (supporterRoleID === null) || (supportersChannelID === null)) return console.log('B/T/Y/S/C is null')

        if (!oldMember.roles.cache.has(boosterRoleID) && newMember.roles.cache.has(boosterRoleID)) {

            guild.channels.cache.get(supportersChannelID).send(`${newMember} has just supported I Talk on **Discord**. Welcome to <#${supportersChannelID}>!\n\nYour access to this channel will not expire once your Boost expires. Thank you for the support. <:bITFGift:1022548639542951977>`);

            newMember.roles.add(supporterRoleID);

        }

        if (!oldMember.roles.cache.has(twitchRoleID) && newMember.roles.cache.has(twitchRoleID)) {

            guild.channels.cache.get(supportersChannelID).send(`${newMember} has just supported I Talk on **Twitch**. Welcome to <#${supportersChannelID}!\n\nYour access to this channel will not expire once your subscription expires. Thank you for the support. <:bITFBits:1022548606995136572>`);

            newMember.roles.add(supporterRoleID);

        }

        if (!oldMember.roles.cache.has(youtubeRoleID) && newMember.roles.cache.has(youtubeRoleID)) {

            guild.channels.cache.get(supportersChannelID).send(`${newMember} has just supported I Talk on **YouTube**. Welcome to <#${supportersChannelID}>!\n\nYour access to this channel will not expire once your membership expires. Thank you for the support. <:bITFVictory:1063265610303295619>`);

            newMember.roles.add(supporterRoleID);

        }

    });

};