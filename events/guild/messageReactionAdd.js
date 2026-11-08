const CONFIG = require('../../models/config.js');

module.exports = async (Discord, client, reaction, user) => {
    const message = reaction.message;
    const cData = await CONFIG.findOne({ guildID: process.env.GUILDID });

    if (!cData) return;
    if (!cData.vxtwitter) return;
    if (user.bot) return;

    if (reaction.message.channel.id === data.modChat || reaction.message.channel.id === '1295133102787526676') {
        if (reaction.emoji.name === 'vxtwitterfy') {
            const twitterRegex = /(https:\/\/twitter\.com\/)|(https:\/\/x\.com\/)/;

            if (message.content.match(twitterRegex)) {
                const messageSplit = message.content.split(' ');
                const twitterIndex = messageSplit.findIndex((msg) => msg.includes('.com/'));

                const preLink = messageSplit[twitterIndex];
                const repLink = preLink.replace(/(twitter)|(x)/, 'fxtwitter');

                await message.reply({ content: repLink });
                await message.reactions.removeAll();
            }
        }
    }
}