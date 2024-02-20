const CONFIG = require('../../models/config.js');
const LCONFIG = require('../../models/logconfig.js');
const GTB = require('../../models/gtb.js');
const SCHEDULE = require('../../models/schedules.js');
const CUSTOM = require('../../models/customs.js');
const APPEALS = require('../../models/appeals.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = async (Discord, client, interaction) => {

    if (interaction.isModalSubmit()) {

        if (interaction.customId === 'schedule-msg') {

            SCHEDULE.findOne({

                guildID: interaction.guild.id

            }, async (err, data) => {

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
                    )

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

        } else if (interaction.customId === 'appeal-modal') {
            let appealMessage = interaction.fields.getTextInputValue('appeal-msg') || 'None';
            let appealNotes = interaction.fields.getTextInputValue('appeal-notes') || 'None';
            let appealAttachment = interaction.fields.getTextInputValue('appeal-attachments') || 'None';
            var banReason;

            await interaction.client.guilds.cache.get('614193406838571085').bans.fetch(interaction.user.id).then((ban) => banReason = ban.reason).catch((err) => banReason = 'None');

            APPEALS.findOne({
                guildID: interaction.guild.id,
                userID: interaction.user.id
            }, async (err, data) => {
                if (err) return console.log(err);
                if (data) return interaction.reply({ content: 'You already have an appeal open! <:bITFWave:1022548691988512778>\n\nWe review appeals every mod meeting and as such, it may take a while for them to be processed and reviewed.\n\nIf you have additional context, evidence, or information you would like to add to the appeal, message <@99299332494200832> for now.', ephemeral: true });

                const appealEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.displayName})`, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
                    .addFields([
                        { name: 'Appeal Message', value: appealMessage.slice(0, 1023) || 'None', inline: true },
                        { name: 'Ban Reason', value: banReason || '???', inline: true },
                        { name: 'Additional Notes', value: appealNotes || 'None', inline: false },
                        { name: 'Additional Files', value: appealAttachment || 'None', inline: false }
                    ])
                    .setColor('#FEBA00')
                    .setFooter({ text: `Appeal Pending  •  User ID: ${interaction.user.id}` })
                    .setTimestamp()

                const appealEmbedOL = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.displayName})`, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
                    .addFields([
                        { name: 'Appeal Message', value: `${appealMessage.slice(0, 970)}... (see full message)` || 'None', inline: true },
                        { name: 'Ban Reason', value: banReason || '???', inline: true },
                        { name: 'Additional Notes', value: appealNotes || 'None', inline: false },
                        { name: 'Additional Files', value: appealAttachment || 'None', inline: false }
                    ])
                    .setColor('#FEBA00')
                    .setFooter({ text: `Appeal Pending  •  User ID: ${interaction.user.id}` })
                    .setTimestamp()

                const staffButtons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('appeal-accept')
                            .setEmoji('1022548602255589486')
                            .setLabel('Approve (Unban)')
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('appeal-deny')
                            .setEmoji('1063265618155020358')
                            .setLabel('Deny (Ban)')
                            .setStyle(ButtonStyle.Danger),
                    );

                const staffButtonsOL = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('appeal-seemsg')
                            .setEmoji('1063265606566166628')
                            .setLabel('Preview Full Message')
                            .setStyle(ButtonStyle.Primary),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('appeal-accept')
                            .setEmoji('1022548602255589486')
                            .setLabel('Approve (Unban)')
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('appeal-deny')
                            .setEmoji('1063265618155020358')
                            .setLabel('Deny (Ban)')
                            .setStyle(ButtonStyle.Danger),
                    );

                if (appealMessage.length < 1024) {
                    interaction.client.channels.cache.get('1198024034437320774').send({ content: `<@&821072490452353095> A pending appeal is open for votes!`, embeds: [appealEmbed], components: [staffButtons] }).then(async (amsg) => {
                        await amsg.react('<:aITFUpvote:1022548599697051790>');
                        await amsg.react('<:bITFThink:1022548686158442537>');
                        await amsg.react('<:aITFDownvote:1022548597390180382>');

                        const newAppealData = new APPEALS({
                            guildID: interaction.guild.id,
                            msgID: amsg.id,
                            userID: interaction.user.id,
                            appealmsg: appealMessage,
                            notes: appealNotes,
                            attachs: appealAttachment,
                            pendingstatus: false
                        });

                        newAppealData.save().catch((err) => console.log(err))
                    });
                } else {
                    interaction.client.channels.cache.get('1198024034437320774').send({ content: `<@&821072490452353095> A pending appeal is open for votes!`, embeds: [appealEmbedOL], components: [staffButtonsOL] }).then(async (amsg) => {
                        await amsg.react('<:aITFUpvote:1022548599697051790>');
                        await amsg.react('<:bITFThink:1022548686158442537>');
                        await amsg.react('<:aITFDownvote:1022548597390180382>');

                        const newAppealData = new APPEALS({
                            guildID: interaction.guild.id,
                            msgID: amsg.id,
                            userID: interaction.user.id,
                            appealmsg: appealMessage,
                            notes: appealNotes,
                            attachs: appealAttachment,
                            pendingstatus: false
                        });

                        newAppealData.save().catch((err) => console.log(err))
                    });
                }

                const fileEmbed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.displayName})`, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
                    .setDescription(`<@${interaction.user.id}> has filed an appeal and obtained the <@&1208961459283959848> role.`)
                    .setFooter({ text: `User ID: ${interaction.user.id}` })
                    .setTimestamp()
                    .setColor('#EDC351')

                await interaction.client.channels.cache.get('803199322379780117').send({ embeds: [fileEmbed] });

                await interaction.reply({ content: 'Your I Talk Server Ban Appeal has been submitted.\n\nPlease be patient for a response as appeals are gone over every Mod Meeting finalized by I Talk.', ephemeral: true });
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

                    APPEALS.findOne({
                        msgID: interaction.message.id
                    }, async (aerr, adata) => {
                        if (aerr) return console.log(aerr);

                        switch (interaction.customId) {

                            case "setup-reset":

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

                            case "setup-cancel":

                                await interaction.update({
                                    content: 'Configuration reset cancelled.',
                                    components: []
                                });

                                break;

                            case "gtb-reset":

                                await gtbData.delete();

                                const newGTBData = new GTB({
                                    guildID: interaction.guild.id,
                                    round1: [],
                                    round2: [],
                                    round3: [],
                                    round4: [],
                                    round5: [],
                                    round6: [],
                                    round7: [],
                                    round8: [],
                                    round9: [],
                                    round10: [],
                                    round11: [],
                                    round12: [],
                                    round13: [],
                                    round14: [],
                                    round15: [],
                                    round16: [],
                                    round17: [],
                                    round18: [],
                                    round19: [],
                                    round20: []
                                });

                                newGTBData.save().catch((err) => console.log(err));

                                await interaction.update({ content: 'Reset all Guess the Blank images and answers. Use the `/gtb-add` command to re-add their values.', components: [] });

                                break;

                            case "gtb-reset-cancel":

                                await interaction.update({
                                    content: 'Guess the Blank data reset cancelled.',
                                    components: []
                                });

                                break;

                            case "appeal-seemsg":
                                if (!adata) await interaction.reply({ content: 'There is no full preview available.', ephemeral: true });

                                await interaction.reply({ content: adata.appealmsg, ephemeral: true });

                                break;

                            case "appeal-accept":
                                const optionButtons = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('appeal-accept-sure')
                                            .setEmoji('1022548599697051790')
                                            .setLabel('Yes')
                                            .setStyle(ButtonStyle.Success),
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('appeal-accept-cancel')
                                            .setEmoji('1022548597390180382')
                                            .setLabel('No')
                                            .setStyle(ButtonStyle.Danger),
                                    );

                                await interaction.reply({ content: 'This will unban <@' + adata.userID + '> (' + adata.userID + ') from the main server.\n\nAre you sure? Ensure that you have discussed this decision with other moderators/I Talk first! <:bITFSweat:1022548683176284281>', components: [optionButtons], ephemeral: true });

                                break;

                            case "appeal-deny":
                                const optionButtons2 = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('appeal-deny-sure')
                                            .setEmoji('1022548599697051790')
                                            .setLabel('Yes')
                                            .setStyle(ButtonStyle.Success),
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('appeal-deny-cancel')
                                            .setEmoji('1022548597390180382')
                                            .setLabel('No')
                                            .setStyle(ButtonStyle.Danger),
                                    );

                                await interaction.reply({ content: 'This will ban <@' + adata.userID + '> (' + adata.userID + ') from the appeals server.\n\nAre you sure? Ensure that you have discussed this decision with other moderators/I Talk first! <:bITFSweat:1022548683176284281>', components: [optionButtons2], ephemeral: true });

                                break;

                            case "appeal-accept-sure":
                                if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.update({ content: 'Ran into an issue trying to unban or accept that appeal, you do not have permission!', components: [], ephemeral: true });

                                const aUser = interaction.message.content.split('(')[1].split(')')[0];

                                if (!interaction.client.users.cache.get(aUser)) return interaction.update({ content: 'User not found, are you sure they haven\'t already left? <:bITFCry:1022548623243886593>' });

                                const acceptEmbed = new EmbedBuilder()
                                    .setAuthor({ name: `Appeal Approved by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
                                    .addFields([
                                        { name: 'User', value: `${interaction.client.users.cache.get(aUser).username}#${interaction.client.users.cache.get(aUser).discriminator}\n(${interaction.client.users.cache.get(aUser).displayName})`, inline: true },
                                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}\n(${interaction.user.displayName})`, inline: true },
                                        { name: 'Date', value: `<t:${Math.round((interaction.message.createdTimestamp) / 1000)}:F> (<t:${Math.round((interaction.message.createdTimestamp) / 1000)}:R>)`, inline: false }
                                    ])
                                    .setColor('#00FF00')
                                    .setFooter({ text: `User ID: ${aUser}` })
                                    .setTimestamp()

                                try {
                                    await interaction.guild.members.unban(aUser);
                                    await interaction.client.channels.cache.get('794486722356183052').send({ embeds: [acceptEmbed] });
                                    await interaction.client.channels.cache.get('1208961703002378341').send({ content: `<@${appealaUserUserID}> Your appeal has been accepted. Restart your Discord (CTRL + R) and rejoin using the invite <https://discord.gg/italk>.` });
                                    await interaction.reply({ content: 'Successfully unbanned and notified the user! <:bITFVictory:1063265610303295619>' });

                                    APPEALS.findOne({
                                        userID: aUser
                                    }, async (err, apdata) => {
                                        if (err) return console.log(err);
                                        if (apdata) {
                                            const appealMessage = await interaction.client.channels.cache.get('1198024034437320774').messages.fetch(apdata.msgID);

                                            if (appealMessage) {
                                                const appealEmbed = appealMessage.embeds[0];

                                                if (appealEmbed) {
                                                    let newApproveEmbed = EmbedBuilder.from(appealEmbed).setColor('#00FF00').setFooter({ text: `Appeal Approved  •  User ID: ${dUser}` });

                                                    await appealMessage.edit({ embeds: [newApproveEmbed] });
                                                }
                                            }

                                            await apdata.delete();
                                        }
                                    });
                                } catch (err) {
                                    await interaction.update({ content: 'Ran into an issue trying to unban or accept that appeal, are you sure they are banned? <:bITFCry:1022548623243886593>\n```' + err + '```', components: [], ephemeral: true });
                                }

                                break;

                            case "appeal-deny-sure":
                                if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.update({ content: 'Ran into an issue trying to deny that appeal, you do not have permission!', components: [], ephemeral: true });

                                const dUser = interaction.message.content.split('(')[1].split(')')[0];

                                if (!interaction.client.users.cache.get(dUser)) return interaction.update({ content: 'User not found, are you sure they haven\'t already left or been denied? <:bITFCry:1022548623243886593>' });

                                const denyEmbed = new EmbedBuilder()
                                    .setAuthor({ name: `Appeal Denied by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true }) })
                                    .addFields([
                                        { name: 'User', value: `${interaction.client.users.cache.get(dUser).username}#${interaction.client.users.cache.get(dUser).discriminator}\n(${interaction.client.users.cache.get(dUser).displayName})`, inline: true },
                                        { name: 'Moderator', value: `${interaction.user.username}#${interaction.user.discriminator}\n(${interaction.user.displayName})`, inline: true },
                                        { name: 'Date', value: `<t:${Math.round((interaction.message.createdTimestamp) / 1000)}:F> (<t:${Math.round((interaction.message.createdTimestamp) / 1000)}:R>)`, inline: false }
                                    ])
                                    .setColor('#FF0000')
                                    .setFooter({ text: `User ID: ${dUser}` })
                                    .setTimestamp()

                                try {
                                    await interaction.client.channels.cache.get('794486722356183052').send({ embeds: [denyEmbed] });
                                    await interaction.client.users.cache.get(dUser).send({ content: `🔧 **I Talk Server Ban Appeals**\n\nAfter consideration, your I Talk Server ban appeal has been denied and you can no longer appeal.` }).catch((err) => { return });
                                    await interaction.client.guilds.cache.get('685876599199236173').members.ban(dUser, { reason: 'After consideration, your I Talk Server ban appeal has been denied.' });

                                    APPEALS.findOne({
                                        userID: dUser
                                    }, async (err, apdata) => {
                                        if (err) return console.log(err);

                                        if (apdata) {
                                            await interaction.client.channels.cache.get('1198024034437320774').messages.fetch(apdata.msgID).then(async (appealMessage) => {
                                                if (appealMessage) {
                                                    const appealEmbed = appealMessage.embeds[0];

                                                    if (appealEmbed) {
                                                        let newDenyEmbed = EmbedBuilder.from(appealEmbed).setColor('#FF0000').setFooter({ text: `Appeal Denied  •  User ID: ${dUser}` });

                                                        await appealMessage.edit({ content: null, embeds: [newDenyEmbed] });

                                                        const newDenyRow = ActionRowBuilder.from(appealMessage.components[0]);

                                                        newDenyRow.components.find((button) => button.data.custom_id === 'appeal-accept').setDisabled(true);
                                                        newDenyRow.components.find((button) => button.data.custom_id === 'appeal-deny').setDisabled(true);

                                                        appealMessage.update({ components: [newDenyRow] });
                                                    }
                                                }
                                            });

                                            await apdata.delete();
                                        }
                                    });

                                    await interaction.update({ content: 'Successfully banned the user and denied their appeal! <:bITFVictory:1063265610303295619>', components: [], ephemeral: true });
                                } catch (err) {
                                    await interaction.update({ content: 'Ran into an issue trying to deny that appeal! <:bITFCry:1022548623243886593>\n```' + err + '```', components: [], ephemeral: true });
                                }

                                break;

                            case "appeal-accept-cancel":
                                await interaction.update({ content: 'The user will not be unbanned as requested. <:bITFGG:1022548636481114172>', components: [], ephemeral: true });

                                break;

                            case "appeal-deny-cancel":
                                await interaction.update({ content: 'The user will not be banned as requested. <:bITFGG:1022548636481114172>', components: [], ephemeral: true });

                                break;

                            default:
                                break;
                        }
                    });
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

}

async function emergencyEmbedAlert(interaction, userRequested, reason) {

    CONFIG.findOne({

        guildID: interaction.guild.id

    }, async (cferr, cfdata) => {

        if (cferr) return console.log(cferr);
        if (!cfdata) return;

        const assistance_embed = new EmbedBuilder()
            .setTitle(`Assistance Request`)
            .setDescription(`${userRequested} (@${interaction.user.username}) has flagged an __**[emergency](https://discord.com/channels/${interaction.message.guild.id}/${interaction.message.channel.id})**__ in ${interaction.message.channel}!\n\n- **React with <:bITFNotes:1022548667317624842> to confirm you are handling this request.**\n\nSelected Reason: **${reason}**`)
            .setColor('eed202')
            .setFooter({
                text: 'Nobody is handling this request yet',
                iconURL: userRequested.displayAvatarURL({
                    dynamic: true
                })
            })
            .setTimestamp()

        await interaction.client.channels.cache.get(cfdata.modChat).send({ content: `<@&672857887894274058> <@&614196214078111745> Somebody needs your help!`, embeds: [assistance_embed] }).then(async (assistMessage) => {

            await assistMessage.react(`<:bITFNotes:1022548667317624842>`);

            const dealFilter = (reaction, userRequested) => reaction.emoji.id === '1022548667317624842' && !userRequested.bot;

            const reactionAdded = await assistMessage.createReactionCollector(dealFilter, {
                time: 10800000
            });

            reactionAdded.on('collect', async (r, user) => {

                const assistanceEmbed2 = new EmbedBuilder()
                    .setTitle(`Emergency Being Handled`)
                    .setDescription(`${userRequested} (@${interaction.user.username}) has flagged an __**[emergency](https://discord.com/channels/${interaction.message.guild.id}/${interaction.message.channel.id})**__ in ${interaction.message.channel}!\n\nSelected Reason: **${reason}**.`)
                    .setColor('ff5154')
                    .setFooter({
                        text: 'This request is being handled',
                        iconURL: user.displayAvatarURL({
                            dynamic: true
                        })
                    })
                    .setTimestamp()

                if (!user.bot && r.emoji.id === '1022548667317624842') {

                    await assistMessage.edit({ embeds: [assistanceEmbed2] });

                    await assistMessage.reactions.removeAll().catch(error => console.error(error));

                }

            });

        });

    });

}