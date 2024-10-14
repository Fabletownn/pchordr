const { ChannelType } = require('discord.js');
const CONFIG = require('../../models/config.js');

module.exports = async (Discord, client, message) => {
    if (message.author.bot) return;
    if (message.channel.isDMBased()) return;
    if (message.guild === null) return;

    CONFIG.findOne({
        guildID: message.guild.id
    }, async (err, data) => {
        if (err) return console.log(err);
        if (!data) return;

        ////////////////////// VXTwitter
        if (message.channel.id === data.modChat || message.channel.id === '1295133102787526676') {
            if (data.vxtwitter === true) {
                const twitterRegex = /(https:\/\/twitter\.com\/)|(https:\/\/x\.com\/)/;

                if (message.content.match(twitterRegex)) {
                    await message.react('<a:vxtwitterfy:1226754754621870130>');
                }
            }
        }

        ////////////////////// Autopublish
        if (message.channel.type === ChannelType.GuildAnnouncement) {
            if (message.content.startsWith('=')) setTimeout(() => message.delete(), 1800000);

            if (data.autopublish === true) {
                if ((message.crosspostable) && (!message.content.startsWith('='))) {
                    await message.crosspost();
                }
            }
        }

        ////////////////////// Server Updates and Poll Notifications
        if ((data.serverUpdatesChat !== null) && (data.pollsChat !== null)) {
            if ((message.channel.id === data.serverUpdatesChat) && (!message.content.startsWith('='))) client.channels.cache.get('614193406842765375').send(`There has been a new server update posted, you can read more in <#${data.serverUpdatesChat}>. <:bITFGG:1022548636481114172>`);
            if ((message.channel.id === data.pollsChat) && (!message.content.startsWith('='))) client.channels.cache.get('614193406842765375').send(`There has been a new poll posted, check it out and vote in <#${data.pollsChat}>! <:bITFCool:1022548621360635994>`);
        }

        ////////////////////// General Greeting
        if (data.generalChat !== null) {
            const greetingArray = ['hi', 'hey', 'hello', 'wassup', 'sup', 'what\'s up', 'hiya'];
            const goodmorningArray = ['goodmorning', 'good morning', 'gmorning', 'g\'morning'];
            const goodnightArray = ['goodnight', 'good night', 'gnight', 'g\'night'];

            if (message.channel.id === data.generalChat) {
                if (data.greeting === true) {
                    const randomGreetArray = [`<:bITFHi:1022548645641474129>`, `<:bITFGift:1022548639542951977>`, `<:bITFBits:1022548606995136572>`, `<a:bITFLove:1022586073043435611>`, `<:dNickLove:798240179894222859>`];
                    const greetReaction = randomGreetArray[Math.floor(Math.random() * randomGreetArray.length)];

                    if (greetingArray.some((greeting) => message.content.toLowerCase() === greeting)) await message.react(greetReaction).catch(() => {  });

                    if (goodmorningArray.some((gm) => message.content.toLowerCase().startsWith(gm)) || goodnightArray.some(gn => message.content.toLowerCase().startsWith(gn))) await message.react('<a:bITFPeace:1063268900730568735>').then(() => message.react('<a:bITFLove:1022586073043435611>')).catch(() => {  });
                    if (message.content.toLowerCase().startsWith('welcome') || message.content.toLowerCase().includes('i\'m new') || message.content.toLowerCase().includes('im new')) await message.react(greetReaction).catch(() => {  });
                }
            }
        }

        ////////////////////// Giveaway Winner Setup
        if (data.giveawayChannel !== null && message.mentions.users.size >= 1) {
            if (message.channel.id === data.giveawayChannel) {
                if (data.autogiveaway === true) {
                    if (data.modChat !== null) {
                        message.guild.channels.cache.get(data.modChat).send({ content: '<@152597531824619521>:' });

                        // Clear channel
                        if (data.giveawayWinnerChannel !== null) {
                            await message.guild.channels.cache.get(data.giveawayWinnerChannel).bulkDelete(50);
                            await message.guild.channels.cache.get(data.modChat).send({ content: `Cleared out the <#${data.giveawayWinnerChannel}> channel..` });
                        }

                        // Remove winner role from previous winner(s)
                        if (data.giveawayWinnerRole !== null) {
                            await message.guild.roles.cache.find(role => role.id === data.giveawayWinnerRole).members.forEach(async (winner) => {
                                await winner.roles.remove(data.giveawayWinnerRole);
                                await message.guild.channels.cache.get(data.modChat).send({ content: `Removed <@&${data.giveawayWinnerRole}> role from <@${winner.user.id}>..`, allowedMentions: { parse: [] } });
                            });

                            await message.mentions.users.forEach(async (winner) => {
                                await message.guild.members.cache.get(winner.id).roles.add(data.giveawayWinnerRole);
                                await message.guild.channels.cache.get(data.modChat).send({ content: `Added <@&${data.giveawayWinnerRole}> role to <@${winner.id}>..`, allowedMentions: { parse: [] } });
                            });
                        }

                        setTimeout(async () => await message.guild.channels.cache.get(data.modChat).send({ content: `<:bITFGG:1022548636481114172>` }), 1500);
                    }
                }
            }
        }
    });
}