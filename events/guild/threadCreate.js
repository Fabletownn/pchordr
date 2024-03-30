const CONFIG = require('../../models/config.js');

module.exports = async (Discord, client, thread, newlyCreated) => {
    CONFIG.findOne({
        guildID: process.env.GUILDID
    }, async (err, data) => {
        if (err) return console.log(err);
        if (!data) return;

        if (newlyCreated) {
            if ((data.artChat !== null) && (data.gpChat !== null) && (data.modRole !== null) && (data.artdelete !== null)) {
                if (data.artdelete === false) return;

                thread.fetchStarterMessage().then((post) => {
                    console.log(post);

                    if ((thread.parentId === data.artChat || thread.parentId === data.gpChat) && (post.attachments.size <= 0) && (!post.member.roles.cache.has(data.modRole)) && (!post.content.includes('https://')) && (!post.content.includes('www.'))) {
                        if (post.author.bot) return;

                        setTimeout(() => thread.send(`<@${thread.ownerId}>: Make sure your post has an image or media link attached to it! This post will automatically delete in 5 seconds. <a:bITFLeave:1063266447251492935>`), 1500);

                        setTimeout(() => thread.delete(), 5500);
                    }
                });
            }
        }
    });
}