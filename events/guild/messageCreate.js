const { Discord, Client, ChannelType, AttachmentBuilder } = require('discord.js');
const CONFIG = require('../../models/config.js');
const TRACK = require('../../models/trackers.js');
const fs = require('fs');

module.exports = async (Discord, client, message) => {

    if (message.author.bot) return;
    if (message.channel.isDMBased()) return;
    if (message.guild === null) return;

    CONFIG.findOne({

        guildID: message.guild.id

    }, async (err, data) => {

        if (err) return console.log(err);
        if (!data) return;

        if (message.channel.id === data.modChat) {

            if (data.vxtwitter === true) {

                const twitterRegex = /(https:\/\/twitter\.com\/)|(https:\/\/x\.com\/)/;

                if (message.content.match(twitterRegex)) {

                    const messageSplit = message.content.split(' ');
                    const twitterIndex = messageSplit.findIndex(msg => msg.includes('.com/'));

                    const preLink = messageSplit[twitterIndex];
                    const repLink = preLink.replace(/(twitter)|(x)/, 'vxtwitter');

                    await message.react('✨');

                    const reactionFilter = (reaction, userRequested) => reaction.emoji.id === '✨' && !reaction.user.bot && userRequested.id !== '363766977585479680';

                    const vxReaction = await message.createReactionCollector({
                        reactionFilter,
                        time: 300000
                    });

                    vxReaction.on('collect', async (r, user) => {

                        if (!user.bot) {

                            await message.reply(repLink);

                            await r.users.remove(user.id);
                            await r.users.remove(client.user.id);

                        }

                    });

                    vxReaction.on('end', async (collected) => {

                        if (collected.size <= 0) await message.reactions.removeAll();

                    });

                }

            }

        }

        if (message.channel.type === ChannelType.GuildAnnouncement) {

            if (message.content.startsWith('=')) setTimeout(() => message.delete(), 1800000);

            if (data.autopublish === true) {

                if ((message.crosspostable) && (!message.content.startsWith('='))) {

                    await message.crosspost();

                }

            }

        }

        if ((data.serverUpdatesChat !== null) && (data.pollsChat !== null)) {

            if ((message.channel.id === data.serverUpdatesChat) && (!message.content.startsWith('='))) client.channels.cache.get('614193406842765375').send(`There has been a new server update posted, you can read more in <#${data.serverUpdatesChat}>. <:bITFGG:1022548636481114172>`);

            if ((message.channel.id === data.pollsChat) && (!message.content.startsWith('='))) client.channels.cache.get('614193406842765375').send(`There has been a new poll posted, check it out and vote in <#${data.pollsChat}>! <:bITFCool:1022548621360635994>`);

        }

        if ((data.artChat !== null) && (data.gpChat !== null) && (data.modRole !== null) && (data.artdelete !== null)) {

            if ((message.channel.id === data.artChat || message.channel.id === data.gpChat) && (message.attachments.size <= 0) && (!message.member.roles.cache.has(data.modRole)) && (!message.content.includes('https://')) && (!message.content.includes('www.'))) {

                if (data.artdelete === true) {

                    if (message.author.bot) return;

                    await message.delete();
                    await message.channel.send(`${message.author} This channel is meant for **attachments and/or links only!** (images, videos, social media post links, etc) Create a thread under a post to discuss it.`).then(msg => setTimeout(() => msg.delete(), 10000));

                }

            }

        }

        if (data.generalChat !== null) {

            const greetingArray = ['hi', 'hey', 'hello', 'wassup', 'sup', 'what\'s up', 'hiya'];
            const goodmorningArray = ['goodmorning', 'good morning', 'gmorning', 'g\'morning'];
            const goodnightArray = ['goodnight', 'good night', 'gnight', 'g\'night'];

            if (message.channel.id === data.generalChat) {

                if (data.greeting === true) {

                    const randomGreetArray = [`<:bITFHi:1022548645641474129>`, `<:bITFGift:1022548639542951977>`, `<:bITFBits:1022548606995136572>`, `<a:bITFLove:1022586073043435611>`, `<:dNickLove:798240179894222859>`];

                    const greetReaction = randomGreetArray[Math.floor(Math.random() * randomGreetArray.length)];

                    if (greetingArray.some((greeting) => message.content.toLowerCase() === greeting)) await message.react(greetReaction).catch((err) => { return });

                    if (goodmorningArray.some((gm) => message.content.toLowerCase().startsWith(gm)) || goodnightArray.some(gn => message.content.toLowerCase().startsWith(gn))) await message.react('<a:bITFPeace:1063268900730568735>').then(() => message.react('<a:bITFLove:1022586073043435611>')).catch((err) => { return });

                    if (message.content.toLowerCase().startsWith('welcome') || message.content.toLowerCase().includes('i\'m new') || message.content.toLowerCase().includes('im new')) await message.react(greetReaction).catch((err) => { return });

                }

            }

        }

        if (data.giveawayChannel !== null) {
            if (message.channel.id === data.giveawayChannel) {
                if (data.autogiveaway === true) {
                    if (data.modChat !== null) {
                        message.guild.channels.cache.get(data.modChat).send({ content: '<@528759471514845194>:' });
                        // Clear channel
                        if (data.giveawayWinnerChannel !== null) {
                            message.guild.channels.cache.get(data.giveawayWinnerChannel).bulkDelete(50).then(() => {
                                message.guild.channels.cache.get(data.modChat).send({ content: `Cleared out the <#${data.giveawayWinnerChannel}> channel..` });
                            });
                        }

                        // Remove winner role from previous winner(s)
                        if (data.giveawayWinnerRole !== null) {
                            let roleCounter = 0;

                            message.guild.roles.cache.find(role => role.id === data.giveawayWinnerRole).members.forEach((winner) => {
                                winner.roles.remove(data.giveawayWinnerRole);
                                roleCounter++;
                                message.guild.channels.cache.get(data.modChat).send({ content: `Removed <@&${data.giveawayWinnerRole}> role from <@${winner.user.id}> (${roleCounter} member(s))..` });
                            });
                        }

                        setTimeout(() => {
                            // Add winner role for every mentioned user in giveaways
                            if (data.giveawayWinnerRole !== null) {
                                let winnerCounter = 0;

                                message.mentions.users.forEach((winner) => {
                                    message.guild.members.cache.get(winner.id).roles.add(data.giveawayWinnerRole);
                                    winnerCounter++;
                                    message.guild.channels.cache.get(data.modChat).send({ content: `Added <@&${data.giveawayWinnerRole}> role to <@${winner.id}> (${winnerCounter} member(s))..` });
                                });
                            }

                            message.guild.channels.cache.get(data.modChat).send({ content: `_ _\nDone! <:bITFGG:1022548636481114172>` });
                        }, 1000);
                    }
                }
            }
        }

    });

    TRACK.findOne({

        guildID: message.guild.id,
        userID: message.author.id

    }, async (err, data) => {

        if (err) return console.log(err);
        if (!data) return;

        data.log += `[${new Date().toLocaleString().replace(',', '')}] [#${message.channel.name}] @${message.author.username} (${message.author.id}): ${message.content || '<No Content - File/Sticker>'}\n`;
        data.sent += 1;
        await data.save().catch((err) => console.log(err));

        if (data.sent >= data.limit) {

            let sessionSave = data.session;
            const fileName = `itf-${data.userID}-tracker.txt`;

            fs.writeFile(fileName, data.log, async function (err) {

                if (err) return console.log(err);

                const transcriptFile = new AttachmentBuilder(`./${fileName}`, { name: fileName });

                await client.channels.cache.get(data.channel).send({ content: `Tracked user <@${data.userID}> has sent **${data.limit} messages**, logs for session #${sessionSave += 1} has been provided below.`, files: [transcriptFile] }).then(async () => {

                    fs.unlink(`./${fileName}`, (err) => {

                        if (err) return console.log(err);

                    });

                    data.sent = 0;
                    data.session += 1;
                    data.log = `(Session #${sessionSave += 1}) Power Chord message tracking log for @${message.author.username} (${message.author.id}) started at ${new Date().toLocaleString().replace(',', '')}..\n\n`;
                    await data.save().catch((err) => console.log(err));

                });

            });

        }

    });

}