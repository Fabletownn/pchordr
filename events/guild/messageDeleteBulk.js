const { EmbedBuilder, WebhookClient } = require('discord.js');
const { PasteClient, ExpireDate, Publicity } = require('pastebin-api');
const pastebinClient = new PasteClient({ apiKey: process.env.PBKEY });
const LCONFIG = require('../../models/logconfig.js');

module.exports = async (Discord, client, messages, channel) => {
    var bulkDeleteInformation = [];
    var bulkDeleteUserIDs = [];

    const guild = channel.guild;

    LCONFIG.findOne({
        guildID: guild.id
    }, async (err, data) => {
        if (err) return console.log(err);
        if (!data) return;
        if (!(guild.channels.cache.get(data.msglogid))) return;
        if (data.ignoredchannels == null) return;
        if (data.ignoredcategories == null) return;
        if (data.logwebhook == null) return;

        const deleteWebhookID = data.logwebhook.split(/\//)[5];
        const deleteWebhookToken = data.logwebhook.split(/\//)[6];
        
        const fetchDeleteWebhooks = await client.channels.cache.get(data.msglogid).fetchWebhooks();
        const fetchedDeleteWebhook = fetchDeleteWebhooks.find((wh) => wh.id === deleteWebhookID);

        if (!fetchedDeleteWebhook) return console.log('No delete webhook found.');

        const deleteWebhook = new WebhookClient({ id: deleteWebhookID, token: deleteWebhookToken });

        if (data.ignoredchannels.some((ignored_channel) => channel.id === ignored_channel)) return;
        if (data.ignoredcategories.some((ignored_cat) => channel.parent.id === ignored_cat)) return;

        const currentDate = new Date().toLocaleString('en-US', { hour12: true });

        messages.forEach((deleted) => {
            if (deleted.partial) return;
            if (deleted.author.bot) return;

            const authorTag = `${deleted.author.tag}`
            const authorDisplayName = deleted.author.displayName;
            const authorID = deleted.author.id;
            const channelName = channel.name;

            let addString = `${authorTag} (${authorDisplayName}) [${authorID}] | (#${channelName}): ${deleted.content > 2000 ? `${deleted.content.slice(0, 2000)}...` : deleted.content}`;
            let userString = `${authorID}`;
            bulkDeleteInformation.push(addString);
            if (!bulkDeleteUserIDs.includes(userString)) bulkDeleteUserIDs.push(userString);
        });

        const pasteURL = await pastebinClient.createPaste({
            code: `If a deleted message's author was a bot, the message is not cached by the bot, or similar, some messages may not be logged. Out of ${messages.size} deleted messages, ${bulkDeleteInformation.length} are logged.\n`
                + `I Talk Server Message Bulk Delete Log @ ${currentDate} UTC:\n----------------------------------------------------------------------\n${bulkDeleteInformation.join('\n')}`,
            expireDate: ExpireDate.OneWeek,
            format: "javascript",
            name: "Bulk Delete Log",
            publicity: Publicity.Unlisted,
        });

        if (pasteURL === null) return;
        if (bulkDeleteInformation.length <= 0) return;

        const rawPasteURL = pasteURL.replace('.com/', '.com/raw/');
        const bulkDeleteEmbed = new EmbedBuilder()
            .setDescription(`**${bulkDeleteInformation.length}**/**${messages.size}** message(s) were deleted and known in cache.\n\n**IDs Involved**: ${(bulkDeleteUserIDs.length > 0) ? bulkDeleteUserIDs.join(' ') : 'Unknown'}`)
            .addFields(
                { name: 'Link', value: rawPasteURL }
            )
            .setTimestamp()
            .setColor('#ED498D');
        
        await deleteWebhook.send({ embeds: [bulkDeleteEmbed] });
    });
}