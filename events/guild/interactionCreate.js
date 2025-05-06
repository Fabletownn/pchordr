const CONFIG = require('../../models/config.js');
const LCONFIG = require('../../models/logconfig.js');
const GTB = require('../../models/gtb.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (Discord, client, interaction) => {
    if (interaction.isButton()) {
        const configData = await CONFIG.findOne({ guildID: interaction.guild.id });
        
        switch (interaction.customId) {
            case 'setup-reset': {
                const logData = await LCONFIG.findOne({ guildID: interaction.guild.id });
                
                if (configData) await configData.deleteOne();
                if (logData) await logData.deleteOne();

                const newConfigData = new CONFIG({
                    guildID: interaction.guild.id,
                    generalChat: null,
                    modChat: null,
                    serverUpdatesChat: null,
                    pollsChat: null,
                    artChat: null,
                    gpChat: null,
                    supportersChat: null,
                    gtbChat: null,
                    adminRole: null,
                    modRole: null,
                    supportersRole: null,
                    boosterRole: null,
                    ytRole: null,
                    twitchRole: null,
                    gtbRole: null,
                    autopublish: false,
                    vxtwitter: false,
                    artdelete: false,
                    greeting: false,
                    autogiveaway: false
                });

                await newConfigData.save().catch((err) => console.log(err));

                const newLogData = new LCONFIG({
                    guildID: interaction.guild.id,
                    msglogid: '',
                    ignoredchannels: [],
                    ignoredcategories: [],
                    logwebhook: '',
                });

                await newLogData.save().catch((err) => console.log(err));
                await interaction.update({ content: 'Set configuration back to the default settings. Use the `/config-edit` and `/log-config-edit` commands to edit their values.', components: [] });
                break;
            }
            case 'setup-cancel':
                await interaction.update({ content: 'Configuration reset cancelled.', components: [] });
                break;
            case 'gtb-reset': {
                const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
                const gtbMap = new Map();

                const newGTBData = new GTB({
                    guildID: interaction.guild.id,
                    rounds: gtbMap,
                    currRound: 0
                });

                if (gtbData)
                    await gtbData.deleteOne();

                await newGTBData.save().catch((err) => console.log(err));
                await interaction.update({ content: (gtbData ? 'Reset data for Guess The Blank successfully.' : 'Set up data for Guess The Blank successfully.'), components: [] });
                break;
            }
            case 'gtb-reset-no':
                await interaction.update({ content: 'Guess The Blank round information will not be reset.', components: [] });
                break;
            case 'gtbrole-yes':
                await interaction.member.roles.remove(configData.gtbRole);
                await interaction.update({ content: `## You are now eligible to earn points in Guess The Blank!\nYour <@&${configData.gtbRole}> role has been removed successfully, and you can now participate in future Guess The Blank games.`, components: [], allowedMentions: { parse: [] } });
                break;
            case 'gtbrole-no':
                await interaction.update({ content: `## You are still not eligible to earn points in Guess The Blank!\nYour <@&${configData.gtbRole}> role has been kept successfully. You may answer in future Guess The Blank games, but not earn any points.`, components: [], allowedMentions: { parse: [] } });
                break;
            case 'assistance-handled': {
                await interaction.client.channels.cache.get(configData.modChat).messages.fetch(interaction.message.id).then(async (assistanceMessage) => {
                    if (assistanceMessage) {
                        const assistanceEmbed = assistanceMessage.embeds[0];

                        if (assistanceEmbed) {
                            let newAssistanceEmbed = EmbedBuilder.from(assistanceEmbed).setColor('#ff5154').setTitle(`Assistance Request Handled`).setFooter({ text: 'This request has been handled by ' + interaction.user.displayName, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

                            await assistanceMessage.edit({ embeds: [newAssistanceEmbed] });

                            const newAssistanceRow = ActionRowBuilder.from(assistanceMessage.components[0]);

                            newAssistanceRow.components.find((button) => button.data.custom_id === 'assistance-handled').setDisabled(true);

                            await assistanceMessage.edit({ components: [newAssistanceRow] });

                            await interaction.reply({ content: 'Successfully marked the assistance request as handled. <:bITFPat:1022548669641277542>', ephemeral: true });
                        }
                    }
                });

                break; 
            }
            case 'report-delete':
                let reportEmbed = interaction.message.embeds[0];
                const reportFields = reportEmbed.fields;
                const reportFooter = reportEmbed.footer.text;
                const reportMessageID = reportFooter.split(' ')[2];
                const reportChannel = reportFields[1].value.replace(/[<#>]/g, '');

                await interaction.guild.channels.cache.get(reportChannel).messages.fetch(reportMessageID).then(async (reportmsg) => {
                    const handledEmbed = EmbedBuilder.from(reportEmbed).setColor('#38DD86').setAuthor({ name: 'Report Handled', iconURL: 'https://i.imgur.com/CGgTthf.png' });

                    await reportmsg.delete();
                    await interaction.message.edit({ embeds: [handledEmbed], components: [] });
                    await interaction.reply({ content: 'Deleted the message. <:bITFAYAYA:1022548602255589486>', ephemeral: true });
                }).catch((err) => { return interaction.reply({ content: 'Unable to delete the message, does it exist? <:bITFHuh:1022548647948333117>', ephemeral: true }) });

                break;
            case 'report-handle':
                let reportEmbed2 = interaction.message.embeds[0];
                const handledEmbed = EmbedBuilder.from(reportEmbed2).setColor('#38DD86').setAuthor({ name: 'Report Handled', iconURL: 'https://i.imgur.com/CGgTthf.png' });

                await interaction.message.edit({ embeds: [handledEmbed], components: [] });
                await interaction.reply({ content: 'Marked the report as handled. <:bITFAYAYA:1022548602255589486>', ephemeral: true });
                break;
            case 'report-dismiss':
                let reportEmbed3 = interaction.message.embeds[0];
                const handledEmbed2 = EmbedBuilder.from(reportEmbed3).setColor('#747F8D').setAuthor({ name: 'Report Dismissed', iconURL: 'https://i.imgur.com/BGYUUfe.png' });

                await interaction.message.edit({ embeds: [handledEmbed2], components: [] });
                await interaction.reply({ content: 'Dismissed the report. <:bITFComfy:1022548611738914886>', ephemeral: true });
                break;
            default:
                break;
        }
    }

    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'assistance-select') {
            switch (interaction.values[0]) {
                case "hatespeech":
                    emergencyEmbedAlert(interaction, interaction.user, `Hate Speech`);
                    await interaction.update({ content: `Thank you! The staff team has been notified and are on their way to handle **Hate Speech**.`, components: [], ephemeral: true });

                    break;
                case "nsfw":
                    emergencyEmbedAlert(interaction, interaction.user, `NSFW Content`);
                    await interaction.update({ content: `Thank you! The staff team has been notified and are on their way to handle **NSFW Content**.`, components: [], ephemeral: true });

                    break;
                case "spam":
                    emergencyEmbedAlert(interaction, interaction.user, `Spam`);
                    await interaction.update({ content: `Thank you! The staff team has been notified and are on their way to handle **Spam**.`, components: [], ephemeral: true });

                    break;
                case "troll":
                    emergencyEmbedAlert(interaction, interaction.user, `Troll`);
                    await interaction.update({ content: `Thank you! The staff team has been notified and are on their way to handle **Troll**.`, components: [], ephemeral: true });

                    break;
                case "other":
                    emergencyEmbedAlert(interaction, interaction.user, `Other`);
                    await interaction.update({ content: `Thank you! The staff team has been notified and are on their way to handle the situation.`, components: [], ephemeral: true });

                    break;
                default:
                    break;
            }
        }
    }

    ///////////////////////// Message Context Interactions
    if (interaction.isMessageContextMenuCommand()) {
        switch (interaction.commandName) {
            case 'Report Message':
                const reportedMessage = interaction.targetMessage;
                const msgAuthor = reportedMessage.author;
                const msgContent0 = reportedMessage.content;
                const msgContent1 = msgContent0.length > 800 ? `${msgContent0.slice(0, 800)}...` : msgContent0;
                const msgContent = msgContent1.replace(/[`]/g, '');
                const msgCreated = Math.round(reportedMessage.createdAt / 1000);
                const reportCreated = Math.round(Date.now() / 1000);
                const msgAttachs = Array.from(reportedMessage.attachments.values());
                const msgAttachment = (msgAttachs.length > 0 ? msgAttachs[0].url : null);

                const reportEmbed = new EmbedBuilder()
                    .setAuthor({ name: `Unhandled Report`, iconURL: 'https://i.imgur.com/tOI2sB7.png' })
                    .addFields([
                        { name: 'User', value: `${msgAuthor}\n(${msgAuthor.id})`, inline: true },
                        { name: 'Channel', value: `<#${interaction.channel.id}>`, inline: true },
                        { name: 'Message', value: `**[Jump](${reportedMessage.url})**`, inline: true },
                        { name: 'Content', value: `\`\`\`${msgContent || 'No Content (File/Sticker)'}\`\`\``, inline: false },
                        { name: 'Posted', value: `<t:${msgCreated}:R>`, inline: true },
                        { name: 'Reported', value: `<t:${reportCreated}:R>`, inline: true },
                        { name: 'Reported By', value: `${interaction.user}\n(${interaction.user.id})`, inline: true }
                    ])
                    .setFooter({ text: `Message ID: ${reportedMessage.id}  •  Reported by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 512 }) })
                    .setThumbnail(msgAuthor.displayAvatarURL({ dynamic: true, size: 1024 }))
                    .setImage(msgAttachment)
                    .setColor('#FF756E')

                const reportRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('report-handle')
                            .setLabel('Mark Handled')
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('report-delete')
                            .setLabel('Delete Message')
                            .setStyle(ButtonStyle.Danger),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('report-dismiss')
                            .setLabel('Dismiss')
                            .setStyle(ButtonStyle.Secondary),
                    );

                await interaction.guild.channels.cache.get('1110289979663470714').send({ embeds: [reportEmbed], components: [reportRow] });
                await interaction.reply({ content: `Submitted your report to the staff team, we'll take action as soon as we can!\n\nFor emergencies or messages that need to be handled ASAP, please use the \`/assistance\` command instead!`, ephemeral: true });
                break;
            default:
                break;
        }
    }
}

async function emergencyEmbedAlert(interaction, userRequested, reason) {
    const configData = await CONFIG.findOne({ guildID: interaction.guild.id });

    const assistanceEmbed = new EmbedBuilder()
        .setTitle(`Assistance Request`)
        .setDescription(`${userRequested} (@${interaction.user.username}) has flagged an **emergency** in ${interaction.message.channel}!\n\nSelected Reason: **${reason}**`)
        .setColor('#eed202')
        .setFooter({
            text: 'This request is not yet handled',
            iconURL: userRequested.displayAvatarURL({
                dynamic: true
            })
        })
        .setTimestamp()

    const assistanceButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('assistance-handled')
                .setEmoji('1022548669641277542')
                .setLabel('Handled')
                .setStyle(ButtonStyle.Primary),
        );

    await interaction.client.channels.cache.get(configData.modChat).send({ content: `<@&672857887894274058> <@&614196214078111745> Somebody needs your help!`, embeds: [assistanceEmbed], components: [assistanceButton] });
}