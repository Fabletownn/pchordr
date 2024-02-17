const {
    Discord,
    ChannelType,
    ActivityType,
    EmbedBuilder,
    AttachmentBuilder,
    WebhookClient
} = require("discord.js");
const SCHEDULE = require('../../models/schedules.js');
const cron = require('node-cron');
const LCONFIG = require('../../models/logconfig.js');
const DELETES = require('../../models/deletes.js');
const EDITS = require('../../models/edits.js');

module.exports = async (Discord, client) => {

    console.log(`${client.user.username} (Rewrite V3) is successfully up and running in ${client.guilds.cache.size} guilds.\n\n`);

    client.user.setPresence({ activities: [{ name: `I Talk's Podcast!`, type: ActivityType.Streaming, url: 'https://twitch.tv/italk69' }] });

    client.channels.cache.get('890718960016838686').send(`${client.user.username} is online.`);

    cron.schedule('* * * * *', () => {

        checkForScheduledMessages(client);

    });

    setInterval(async () => {
        LCONFIG.findOne({
            guildID: '614193406838571085'
        }, async (err, data) => {
            if (err) return;
            if (!data) return;
            if (!data.deletelogid || !client.channels.cache.get(data.deletelogid)) return;
            if (!data.deletewebhook || !data.editwebhook) return;

            const deleteWebhookID = data.deletewebhook.split(/\//)[5];
            const deleteWebhookToken = data.deletewebhook.split(/\//)[6];
            const editWebhookID = data.editwebhook.split(/\//)[5];
            const editWebhookToken = data.editwebhook.split(/\//)[6];

            const fetchDeleteWebhooks = await client.channels.cache.get(data.deletelogid).fetchWebhooks();
            const fetchedDeleteWebhook = fetchDeleteWebhooks.find((wh) => wh.id === deleteWebhookID);
            const fetchEditWebhooks = await client.channels.cache.get(data.editlogid).fetchWebhooks();
            const fetchedEditWebhook = fetchEditWebhooks.find((wh) => wh.id === editWebhookID);

            if (!fetchedDeleteWebhook) return console.log('No delete webhook found.');
            if (!fetchedEditWebhook) return console.log('No edit webhook found.');

            const deleteWebhookClient = new WebhookClient({ id: deleteWebhookID, token: deleteWebhookToken });
            const editWebhookClient = new WebhookClient({ id: editWebhookID, token: editWebhookToken });

            DELETES.find({ guildID: '614193406838571085' }).then((deletes) => {
                deletes.forEach((d) => {
                    deleteWebhookClient.send({ embeds: d.embed })
                        .catch((err) => { console.log('Error uploading delete log, deleting anyway:\n' + err) })
                        .then(() => d.delete().catch((err) => console.log(err))); // NEEDS TESTING ON SOME MESSAGES DELETING WITHOUT BEING SENT
                });
            });

            EDITS.find({ guildID: '614193406838571085' }).then((edits) => {
                edits.forEach((d) => {
                    editWebhookClient.send({ embeds: d.embed })
                        .catch((err) => { console.log('Error uploading edit log, deleting anyway:\n' + err) })
                        .then(() => d.delete().catch((err) => console.log(err))); // NEEDS TESTING ON SOME MESSAGES DELETING WITHOUT BEING SENT
                });
            });
        });
    }, (5000));

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