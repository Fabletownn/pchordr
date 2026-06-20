const { SectionBuilder, ContainerBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const BULKS = require('../../models/bulkdeletes.js');
const LCONFIG = require('../../models/logconfig.js');

module.exports = async (Discord, client, messages, channel) => {
    let bulkDeleteInformation = [];
    let bulkDeleteUserIDs = [];

    const guild = channel.guild;
    const lData = await LCONFIG.findOne({ guildID: guild.id });
    if (!lData) return;
    
    const logChannel = guild.channels.cache.get(lData.msglogid);
    
    for (const deleted of messages.values()) {
        if (deleted.partial) continue;
        if (deleted.author?.bot) continue;
        
        const content = (deleted.content || '').slice(0, 2000);
        const authorTag = deleted.author.tag;
        const authorID = deleted.author.id;
        const channelName = channel.name.replace(/[^a-zA-Z-]/g, ''); // does not like emoji
        
        bulkDeleteInformation.push(`@${authorTag} (${authorID}) | #${channelName}: ${content}`);
        if (!bulkDeleteUserIDs.includes(authorID))bulkDeleteUserIDs.push(bulkDeleteUserIDs);
    }
    
    const logContent = bulkDeleteInformation.reverse().join('\n') +
        + `\n\n${messages.size} messages were deleted in bulk and ${bulkDeleteInformation.length} are logged. Messages may not be logged if they are uncached, sent by a bot, or similar.`;

    const bulkLogText = new SectionBuilder()
        .addTextDisplayComponents((text) =>
            text.setContent(`### **${messages.size}** messages were deleted with **${bulkDeleteInformation.length}** known in cache\n**IDs Involved**: ${(bulkDeleteUserIDs.length > 0) ? bulkDeleteUserIDs.join(', ') : 'Unknown'}`)
        )
        .setButtonAccessory(new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setEmoji('👁️')
            .setCustomId('log-viewbulk')
        );

    const logContainer = new ContainerBuilder()
        .addSectionComponents(bulkLogText)
        .setAccentColor(0xED498D)
    
    const webhookID = lData.logwebhook?.split('/')[5];
    const webhooks = await logChannel?.fetchWebhooks();
    const webhook = webhooks.find((hook) => hook.id === webhookID);
    if (!webhook) return;
    
    try {
        const log = await webhook.send({ components: [logContainer], flags: MessageFlags.IsComponentsV2 });
        if (log) {
            const newBulkData = new BULKS({
                messageID: log.id,
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
                log: logContent
            });
            
            await newBulkData.save();
        }
    } catch (err) {
        return console.log(err);
    }
}