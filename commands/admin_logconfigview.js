const LCONFIG = require('../models/logconfig.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    AllowedMentionsTypes,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log config view')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Views the server\'s message log configuration settings')
        .setDMPermission(false),

    async execute(interaction) {
        LCONFIG.findOne({
            guildID: interaction.guild.id,
        }, async (err, data) => {
            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not view configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.reply({ content: 'Could not view configuration values since data hasn\'t been set up yet. Use the `/config-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            if (data.deletelogid === "" || data.editlogid === "" || data.deletewebhook === "" || data.editwebhook === "") return interaction.reply({ content: 'There is no data applied to the server! Use the `log` command to get started on configuration.' });

            let ignoredCategoryList = [], ignoredChannelList = [];

            for (let i = 0; i < data.ignoredcategories.length; i++) {
                ignoredCategoryList.push(`\`${interaction.guild.channels.cache.get(data.ignoredcategories[i]).name}\``);
            }
            for (let i = 0; i < data.ignoredchannels.length; i++) {
                ignoredChannelList.push(`<#${data.ignoredchannels[i]}>`);
            }

            const deleteWebhookID = data.deletewebhook.split(/\//)[5];
            const editWebhookID = data.editwebhook.split(/\//)[5];

            const fetchDeleteWebhooks = await client.channels.cache.get(data.deletelogid).fetchWebhooks();
            const fetchedDeleteWebhook = fetchDeleteWebhooks.find((wh) => wh.id === deleteWebhookID);
            const fetchEditWebhooks = await client.channels.cache.get(data.editlogid).fetchWebhooks();
            const fetchedEditWebhook = fetchEditWebhooks.find((wh) => wh.id === editWebhookID);

            const viewEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.author.username}${interaction.author.discriminator == 0 ? "" : `#${interaction.author.discriminator}`}`,
                    iconURL: interaction.author.displayAvatarURL({
                        dynamic: true
                    })
                })
                .setDescription(`Use the \`log delete|edit|ignore|unignore\` commands to edit configurations.\n\u200b`)
                .addFields(
                    { name: 'Edited Logs', value: `<#${data.editlogid || '???'}> (${fetchedEditWebhook ? fetchedEditWebhook.name : '???'})`, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: 'Deleted Logs', value: `<#${data.deletelogid || '???'}> (${fetchedDeleteWebhook ? fetchedDeleteWebhook.name : '???'})`, inline: true },
                    { name: 'Ignored Categories', value: ignoredCategoryList.join(', ') ? ignoredCategoryList.join(', ') : 'None', inline: false },
                    { name: 'Ignored Channels', value: ignoredChannelList.join(', ') ? ignoredChannelList.join(', ') : 'None', inline: false },
                )
                .setColor('#3838FC')

            await interaction.reply({ embeds: [viewEmbed] });

        });

    },

};