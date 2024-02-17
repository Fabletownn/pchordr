const LCONFIG = require('../models/logconfig.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    WebhookClient
} = require('discord.js');

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
                    name: 'Update Delete Log Channel ID',
                    value: 'updatedeletes'
                }, {
                    name: 'Update Edit Log Channel ID',
                    value: 'updateedits'
                })
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('value')
                .setDescription('What do you wish to change the config value to? (e.g. on/off or ID)')
                .setRequired(true)
        ),

    async execute(interaction) {
        LCONFIG.findOne({
            guildID: interaction.guild.id,
        }, async (err, data) => {
            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not handle configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.reply({ content: 'Could not configurate values since data hasn\'t been set up yet. Use the `/config-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            const configChoice = interaction.options.get('config').value;
            const configVal = interaction.options.getString('value').toLowerCase();

            switch (configChoice) {
                case "ignorecatchan":
                    const argiChannelOrParentID = configVal.replace(/[<>#]/g, '');
                    const ignoredChannelOrCategory = interaction.guild.channels.cache.get(argiChannelOrParentID);

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
                    const arguiChannelOrParentID = configVal.replace(/[<>#]/g, '');
                    const unignoredChannelOrCategory = interaction.guild.channels.cache.get(arguiChannelOrParentID);

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

                case "updatedeletes":
                    const deletedChannel = interaction.guild.channels.cache.get(configVal);

                    let oldDeletedChannel;
                    let oldDeletedWebhook;
                    let deletedWebhook = false;

                    if (data.deletelogid) oldDeletedChannel = data.deletelogid;
                    if (data.deletewebhook) oldDeletedWebhook = data.deletewebhook;

                    if ((!deletedChannel) || (deletedChannel && deletedChannel.type !== ChannelType.GuildText)) return interaction.reply({ content: 'The channel provided doesn\'t exist or is not text based.' });

                    if (data.deletelogid && data.deletewebhook) {
                        const fetchDeleteWebhooks = await interaction.guild.channels.cache.get(oldDeletedChannel).fetchWebhooks();
                        const deleteWebhookID = oldDeletedWebhook.split(/\//)[5];

                        if ((data) && (data.deletelogid === deletedChannel.id) && (data.deletewebhook === null || (data.deletewebhook !== null && fetchDeleteWebhooks.find((wh) => wh.id === data.deletewebhook.split(/\//)[5])))) return interaction.reply({ content: 'That channel and webhook is already in use.' });

                        if (fetchDeleteWebhooks.find((wh) => wh.id === deleteWebhookID)) client.deleteWebhook(deleteWebhookID).then(() => deletedWebhook = true);
                    }

                    await interaction.guild.channels.cache.get(deletedChannel.id).createWebhook({
                        name: 'Power Chord Delete Logs',
                        avatar: interaction.client.user.displayAvatarURL({ size: 512 })
                    }).then((dwh) => {
                        if (data) {
                            data.deletelogid = deletedChannel.id;
                            data.deletewebhook = dwh.url;
                            data.save().catch((err) => console.log(err));
                        }

                        interaction.reply({ content: 'Deleted messages will now log to the channel <#' + deletedChannel.id + '>.\n\n' + (deletedWebhook ? 'The previous webhook has been deleted, and a new one ' : 'A new webhook ') + 'has been created for deleted logs in the <#' + deletedChannel.id + '> channel. This webhook will send deleted logs using the URL that was generated.' })
                    });

                    break;

                case "updateedits":
                    const editedChannel = interaction.guild.channels.cache.get(configVal);

                    let oldEditedChannel;
                    let oldEditedWebhook;
                    let deletedEditedWebhook = false;

                    if (data.editlogid) oldEditedChannel = data.editlogid;
                    if (data.editwebhook) oldEditedWebhook = data.editwebhook;

                    if ((!editedChannel) || (editedChannel && editedChannel.type !== ChannelType.GuildText)) return interaction.reply({ content: 'The channel provided doesn\'t exist or is not text based.' });

                    if (data.editlogid && data.editwebhook) {
                        const fetchEditWebhooks = await interaction.guild.channels.cache.get(oldEditedChannel).fetchWebhooks();
                        const editWebhookID = oldEditedWebhook.split(/\//)[5];

                        if ((data) && (data.editlogid === editedChannel.id) && (data.editwebhook === null || (data.editwebhook !== null && fetchEditWebhooks.find((wh) => wh.id === data.editwebhook.split(/\//)[5])))) return interaction.reply({ content: 'That channel and webhook is already in use.' });

                        if (fetchEditWebhooks.find((wh) => wh.id === editWebhookID)) client.deleteWebhook(editWebhookID).then(() => deletedEditedWebhook = true);
                    }

                    await interaction.guild.channels.cache.get(editedChannel.id).createWebhook({
                        name: 'Power Chord Edit Logs',
                        avatar: interaction.client.user.displayAvatarURL({ size: 512 })
                    }).then((ewh) => {
                        if (data) {
                            data.editlogid = editedChannel.id;
                            data.editwebhook = ewh.url;
                            data.save().catch((err) => console.log(err));
                        }

                        interaction.reply({ content: 'Edited messages will now log to the channel <#' + editedChannel.id + '>.\n\n' + (deletedEditedWebhook ? 'The previous webhook has been deleted, and a new one ' : 'A new webhook ') + 'has been created for edited logs in the <#' + editedChannel.id + '> channel. This webhook will send edited logs using the URL that was generated.' })
                    });

                    break;

                default:
                    break;

            }

        });

    },

};