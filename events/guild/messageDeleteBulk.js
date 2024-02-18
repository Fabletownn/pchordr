const { Client, ChannelType, EmbedBuilder, WebhookClient } = require('discord.js');
const { PasteClient, ExpireDate, Publicity } = require('pastebin-api');
const pastebinClient = new PasteClient({ apiKey: process.env.PBKEY });
const LCONFIG = require('../../models/logconfig.js');

module.exports = async (Discord, client, messages, channel) => {
    var bulkDeleteInformation = [];

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

            const authorTag = `${deleted.author.username}${deleted.author.discriminator == 0 ? "" : `#${deleted.author.discriminator}`}`;
            const authorDisplayName = deleted.author.displayName;
            const authorID = deleted.author.id;
            const channelName = channel.name;

            let addString = `${authorTag} (${authorDisplayName}) [${authorID}] | (#${channelName}): ${deleted.content > 2000 ? `${deleted.content.slice(0, 2000)}...` : deleted.content}`;
            bulkDeleteInformation.push(addString);
        });

        const pasteURL = await pastebinClient.createPaste({
            code: `If a deleted message's author was a bot, the message is not cached by the bot, or similar, some messages may not be logged. Out of ${messages.size} deleted messages, ${bulkDeleteInformation.length} are logged.\n`
                + `I Talk Server Message Bulk Delete Log @ ${currentDate} UTC:\n----------------------------------------------------------------------\n${bulkDeleteInformation.join('\n')}`,
            expireDate: ExpireDate.OneWeek,
            format: "javascript",
            name: "Bulk Delete Log",
            publicity: Publicity.Unlisted,
        });

        if (pasteURL === null) return console.log('null link')
        if (bulkDeleteInformation.length <= 0) return console.log('no msgs');

        const rawPasteURL = pasteURL.replace('.com/', '.com/raw/');
        const bulkDeleteEmbed = new EmbedBuilder()
            .setDescription(`**${bulkDeleteInformation.length}**/**${messages.size}** message(s) were deleted and known in cache.`)
            .addFields(
                { name: 'Link', value: rawPasteURL }
            )
            .setTimestamp()
            .setColor('#ED498D');
        
        await deleteWebhook.send({ embeds: [bulkDeleteEmbed] });
    });
}