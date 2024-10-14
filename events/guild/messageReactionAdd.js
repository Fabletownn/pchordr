const CONFIG = require('../../models/config.js');

module.exports = async (Discord, client, reaction, user) => {
    const message = reaction.message;

    if (user.bot) return;

    CONFIG.findOne({
        guildID: '614193406838571085'
    }, async (err, data) => {
        if (err) return;
        if (!data) return;
        if (data.vxtwitter === null) return;

        if (reaction.emoji.name === 'vxtwitterfy') {
            if (data.vxtwitter === true) {
                if (reaction.message.channel.id === data.modChat || reaction.message.channel.id === '1295133102787526676') {
                    const twitterRegex = /(https:\/\/twitter\.com\/)|(https:\/\/x\.com\/)/;

                    if (message.content.match(twitterRegex)) {
                        const messageSplit = message.content.split(' ');
                        const twitterIndex = messageSplit.findIndex((msg) => msg.includes('.com/'));

                        const preLink = messageSplit[twitterIndex];
                        const repLink = preLink.replace(/(twitter)|(x)/, 'vxtwitter');

                        await message.reply({ content: repLink });
                        await message.reactions.removeAll();
                    }
                }
            }
        }
    });
}