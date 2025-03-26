const CONFIG = require('../../models/config.js');
const LCONFIG = require('../../models/logconfig.js');
const GTB = require('../../models/gtb.js');
const SCHEDULE = require('../../models/schedules.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async (Discord, client, interaction) => {
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'schedule-msg') {
            SCHEDULE.findOne({
                guildID: interaction.guild.id
            }, async (err) => {
                if (err) return console.log(err);

                let dateInput = interaction.fields.getTextInputValue('schedule-date');
                let timeInput = interaction.fields.getTextInputValue('schedule-time');
                let messageInput = interaction.fields.getTextInputValue('schedule-message');
                let imageInput = interaction.fields.getTextInputValue('schedule-attachment') || null;
                let scheduleID = Math.floor(Math.random() * 1000000);

                if (!dateInput.includes('/')) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **date formatting** you used, and try again.`, ephemeral: false });

                const diMonth = dateInput.split('/')[0];
                const diDay = dateInput.split('/')[1];

                if (!dateInput.match(/\b(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\b/)) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **MM/DD formatting** you used, and try again.`, ephemeral: false });

                if (!timeInput.includes(':')) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **time formatting** you used, and try again (**HH:MM** AM/PM).`, ephemeral: false });
                if (!timeInput.match(/(am|pm)/gmi)) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **time formatting** you used, and try again (HH:MM **AM/PM**).`, ephemeral: false });
                if (!timeInput.includes(' ')) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **time formatting** you used, and try again (HH:MM **(space)** AM/PM).`, ephemeral: false });

                const tiHour = timeInput.split(':')[0];
                const tiMin = timeInput.split(':')[1].split(' ')[0];

                const tiAPM = timeInput.split(' ')[1].toLowerCase();
                const tiFM = timeInput.split(' ')[0];

                if (!tiFM.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **time formatting** you used, and try again.`, ephemeral: false });
                if (!tiAPM.match(/^(am|pm)$/gmi)) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **AM/PM formatting** you used, and try again.`, ephemeral: false });

                if (imageInput && !imageInput.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|mp4|mov))/)) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **image URL formatting** you used, and try again.`, ephemeral: false });
                if ((imageInput) && !imageInput.match(/((cdn|media)\.discord)/)) return interaction.reply({ content: `Unable to schedule a message considering your formatting was incorrect. Please double check the **image URL formatting** you used, and try again. Please make sure it is a CDN Discord attachment.`, ephemeral: false });

                const currentYear = new Date().getFullYear();

                const dateObject = (Date.parse(`${diMonth}-${diDay}-${currentYear} ${tiHour}:${tiMin}:00 ${tiAPM}`));
                const dateObjectUnix = (Date.parse(`${diMonth}-${diDay}-${currentYear} ${tiHour}:${tiMin}:00 ${tiAPM}`) / 1000);

                let addImageText;

                if (imageInput !== null) addImageText = ` with **an image attached**`;
                if (imageInput === null) addImageText = ``;

                const newScheduleData = new SCHEDULE({
                    guildID: interaction.guild.id,
                    scheduleID: scheduleID,
                    timeScheduled: dateObject,
                    sayChannel: interaction.channel.id,
                    sayMessage: messageInput,
                    sayImage: imageInput
                });

                await newScheduleData.save().catch((err) => console.log(err));

                const optViewRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('schedule-viewmsg')
                            .setEmoji('1063265606566166628')
                            .setLabel('View Message')
                            .setStyle(ButtonStyle.Primary),
                    );

                const schedResponse = await interaction.reply({ content: `Scheduled message to send in <#${interaction.channel.id}>, on <t:${dateObjectUnix}:F>${addImageText}. <:bITFGG:1022548636481114172>\n\nSchedule ID: **${scheduleID}**`, components: [optViewRow], ephemeral: true });

                setTimeout(() => schedResponse.edit({ content: `Scheduled message to send in <#${interaction.channel.id}>, on <t:${dateObjectUnix}:F>${addImageText}. <:bITFGG:1022548636481114172>\n\nSchedule ID: **${scheduleID}**`, components: [], ephemeral: true }), 60000);

                interaction.client.on('interactionCreate', async (interaction) => {
                    if (interaction.isButton()) {
                        if (interaction.customId === 'schedule-viewmsg') {
                            if (imageInput !== null) {
                                await interaction.reply({ content: `**The below message/attachment will be sent following the scheduled date.**\n\n${messageInput}`, files: [imageInput], ephemeral: true });
                            } else {
                                await interaction.reply({ content: `**The below message will be sent following the scheduled date.**\n\n${messageInput}`, ephemeral: true });
                            }

                            await schedResponse.edit({ content: `Scheduled message to send in <#${interaction.channel.id}>, on <t:${dateObjectUnix}:F>${addImageText}. <:bITFGG:1022548636481114172>`, components: [], ephemeral: true });
                        }
                    }
                });
            });
        }
    }

    if (interaction.isButton()) {
        CONFIG.findOne({
            guildID: interaction.guild.id
        }, async (cerr, cdata) => {
            if (cerr) return console.log(cerr);

            LCONFIG.findOne({
                guildID: interaction.guild.id
            }, async (lerr, ldata) => {
                if (lerr) return console.log(lerr);

                GTB.findOne({
                    guildID: interaction.guild.id
                }, async (gtbErr, gtbData) => {
                    if (gtbErr) return console.log(gtbErr);
                    if (!gtbData) return;

                    switch (interaction.customId) {
                        case "setup-reset": {
                            if (cdata) await cdata.delete();
                            if (ldata) await ldata.delete();

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

                            newConfigData.save().catch((err) => console.log(err));

                            const newLogData = new LCONFIG({
                                guildID: interaction.guild.id,
                                msglogid: "",
                                ignoredchannels: [],
                                ignoredcategories: [],
                                logwebhook: "",
                            });

                            await newLogData.save().catch((err) => console.log(err));

                            await interaction.update({ content: 'Set configuration back to the default settings. Use the `/config-edit` and `/log-config-edit` commands to edit their values.', components: [] });
                            break;
                        }
                        case "setup-cancel":
                            await interaction.update({
                                content: 'Configuration reset cancelled.',
                                components: []
                            });

                            break;
                        case 'gtb-reset':
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
                        case 'gtb-reset-no':
                            await interaction.update({ content: 'Guess The Blank round information will not be reset.', components: [] });
                            break;
                        case 'assistance-handled':
                            CONFIG.findOne({
                                guildID: interaction.guild.id
                            }, async (cferr, cfdata) => {
                                if (cferr) return console.log(cferr);
                                if (!cfdata) return;

                                await interaction.client.channels.cache.get(cfdata.modChat).messages.fetch(interaction.message.id).then(async (assistanceMessage) => {
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
                            });

                            break;
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
                });
            });
        });
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
            case "Report Message":
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

    CONFIG.findOne({
        guildID: interaction.guild.id
    }, async (cferr, cfdata) => {
        if (cferr) return console.log(cferr);
        if (!cfdata) return;

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

        await interaction.client.channels.cache.get(cfdata.modChat).send({ content: `<@&672857887894274058> <@&614196214078111745> Somebody needs your help!`, embeds: [assistanceEmbed], components: [assistanceButton] });
    });
}