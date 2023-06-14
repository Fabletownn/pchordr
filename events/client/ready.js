const {
    Discord,
    ChannelType,
    ActivityType,
    EmbedBuilder,
    AttachmentBuilder
} = require("discord.js");
const SCHEDULE = require('../../models/schedules.js');
const cron = require('node-cron');

module.exports = async (Discord, client) => {

    console.log(`${client.user.username} (Rewrite V3) is successfully up and running in ${client.guilds.cache.size} guilds.\n\n`);

    client.user.setPresence({ activities: [{ name: `I Talk's Podcast!`, type: ActivityType.Streaming, url: 'https://twitch.tv/italk69' }] });

    cron.schedule('* * * * *', () => {

        checkForScheduledMessages(client);

    });

}

async function checkForScheduledMessages(client) {

    SCHEDULE.find({

        guildID: process.env.GUILDID

    }, (err, data) => {

        if (err) return console.log(err);
        if (!data) return;

        data.forEach(async (d) => {

            const schedTime = d.timeScheduled;

            if (Date.now() > schedTime) {

                if (d.sayImage !== null) {

                    await client.channels.cache.get(d.sayChannel).send({ content: d.sayMessage, files: [d.sayImage] });

                    await d.delete().catch((err) => console.log(err));

                } else {

                    await client.channels.cache.get(d.sayChannel).send({ content: d.sayMessage });

                    await d.delete().catch((err) => console.log(err));

                }

            }

        });

    });

}