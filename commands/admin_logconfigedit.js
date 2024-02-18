const LCONFIG = require('../models/logconfig.js');
const { Client, WebhookClient, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-config-edit')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Edits configuration values of message logging features')
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('config')
                .setDescription('What are you looking to change?')
                .addChoices({
                    name: 'Ignore Category or Channel',
                    value: 'ignorecatchan'
                }, {
                    name: 'Unignore Category or Channel',
                    value: 'unignorecatchan'
                }, {
                    name: 'Update Message Log Channel ID',
                    value: 'updatemsg'
                })
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option.setName('channel')
                .addChannelTypes(ChannelType.GuildCategory, ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildAnnouncement, ChannelType.GuildForum)
                .setDescription('What channel (or category when applicable) would you like to change the configuration value to?')
                .setRequired(true)
        ),

    async execute(interaction) {
        LCONFIG.findOne({
            guildID: interaction.guild.id,
        }, async (err, data) => {
            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not handle configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.reply({ content: 'Could not configurate values since data hasn\'t been set up yet. Use the `/config-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            const configChoice = interaction.options.get('config').value;
            const configVal = interaction.options.getChannel('channel').id;

            switch (configChoice) {
                case "ignorecatchan":
                    const ignoredChannelOrCategory = interaction.guild.channels.cache.get(configVal);

                    if (!ignoredChannelOrCategory) return interaction.reply({ content: 'Invalid channel or category (doesn\'t exist or is invalid).' });

                    if (ignoredChannelOrCategory.type === ChannelType.GuildCategory) {
                        if (data.ignoredcategories.includes(ignoredChannelOrCategory.id)) return interaction.reply({ content: 'That category is already being ignored.' });

                        data.ignoredcategories.push(ignoredChannelOrCategory.id);
                        data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: 'Set the `' + ignoredChannelOrCategory.name + '` category to be ignored in message logs.' }));
                    } else {
                        if (data.ignoredchannels.includes(ignoredChannelOrCategory.id)) return interaction.reply({ content: 'That channel is already being ignored.' });

                        data.ignoredchannels.push(ignoredChannelOrCategory.id);
                        data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: 'Set the <#' + ignoredChannelOrCategory.id + '> channel to be ignored in message logs.' }));
                    }

                    break;

                case "unignorecatchan":
                    const unignoredChannelOrCategory = interaction.guild.channels.cache.get(configVal);

                    if (!unignoredChannelOrCategory) return interaction.reply({ content: 'The channel provided doesn\'t exist or is invalid.' });

                    if (unignoredChannelOrCategory.type === ChannelType.GuildCategory) {
                        if (!data.ignoredcategories.includes(unignoredChannelOrCategory.id)) return interaction.reply({ content: 'That category is not being ignored.' });

                        const ignoredIndex = data.ignoredcategories.indexOf(unignoredChannelOrCategory.id);
                        if (!data.ignoredcategories[ignoredIndex]) return interaction.reply({ content: 'That channel is not being ignored.' });

                        data.ignoredcategories.splice(ignoredIndex, 1);
                        data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: 'Removed the `' + unignoredChannelOrCategory.name + '` category ignorance in message logs.' }));
                    } else {
                        if (!data.ignoredchannels.includes(unignoredChannelOrCategory.id)) return interaction.reply({ content: 'That channel is not being ignored.' });

                        const ignoredIndex = data.ignoredchannels.indexOf(unignoredChannelOrCategory.id);
                        if (!data.ignoredchannels[ignoredIndex]) return interaction.reply({ content: 'That channel is not being ignored.' });

                        data.ignoredchannels.splice(ignoredIndex, 1);
                        data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: 'Removed the <#' + unignoredChannelOrCategory.id + '> channel ignorance in message logs.' }));
                    }

                    break;

                case "updatemsg":
                    const logChannel = interaction.guild.channels.cache.get(configVal);

                    let oldMsgChannel;
                    let oldMsgWebhook;
                    let deletedWebhook = false;

                    if (data.msglogid) oldMsgChannel = data.msglogid;
                    if (data.logwebhook) oldMsgWebhook = data.logwebhook;

                    if ((!logChannel) || (logChannel && logChannel.type !== ChannelType.GuildText)) return interaction.reply({ content: 'The channel provided doesn\'t exist or is not text based.' });

                    if (data.msglogid && data.logwebhook) {
                        const fetchMsgWebhooks = await interaction.guild.channels.cache.get(oldMsgChannel).fetchWebhooks();
                        const botWebhooks = fetchMsgWebhooks.filter((webhook) => webhook.owner.id === interaction.client.user.id && webhook.name.startsWith("Power Chord"));

                        if ((data) && (data.msglogid === logChannel.id) && (data.logwebhook === null || (data.logwebhook !== null && fetchMsgWebhooks.find((wh) => wh.id === data.logwebhook.split(/\//)[5])))) return interaction.reply({ content: 'That channel and webhook is already in use.' });

                        for (let webhook of botWebhooks) await webhook.delete().then(() => deletedWebhook = true);
                    }

                    await interaction.guild.channels.cache.get(logChannel.id).createWebhook({
                        name: 'Power Chord Message Logs',
                        avatar: interaction.client.user.displayAvatarURL({ size: 512 })
                    }).then((mwh) => {
                        if (data) {
                            data.msglogid = logChannel.id;
                            data.logwebhook = mwh.url;
                            data.save().catch((err) => console.log(err));
                        }
                    });

                    await interaction.reply({ content: 'Message logs will now send to the channel <#' + logChannel.id + '>.\n\n' + (deletedWebhook ? 'The previous webhook has been deleted, and a new one ' : 'A new webhook ') + 'has been created for message logs in the <#' + logChannel.id + '> channel. This webhook will send message logs using the URL that was generated.' });

                    break;

                default:
                    break;

            }
        });
    },
};