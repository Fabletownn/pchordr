const LCONFIG = require('../models/logconfig.js');
const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('log-config-view')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Views the server\'s message log configuration settings')
        .setDMPermission(false),

    async execute(interaction) {
        LCONFIG.findOne({
            guildID: interaction.guild.id,
        }, async (err, data) => {
            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not view configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.reply({ content: 'Could not view configuration values since data hasn\'t been set up yet. Use the `/config-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            if (data.msglogid === "" || data.logwebhook === "") return interaction.reply({ content: 'There is no data applied to the server! Use the `/log-config-edit` command to get started on configuration.' });

            let ignoredCategoryList = [], ignoredChannelList = [];

            for (let i = 0; i < data.ignoredcategories.length; i++) {
                ignoredCategoryList.push(`\`${interaction.guild.channels.cache.get(data.ignoredcategories[i]).name}\``);
            }
            for (let i = 0; i < data.ignoredchannels.length; i++) {
                ignoredChannelList.push(`<#${data.ignoredchannels[i]}>`);
            }

            const logWebhookID = data.logwebhook.split(/\//)[5];

            const fetchLogWebhooks = await interaction.client.channels.cache.get(data.msglogid).fetchWebhooks();
            const fetchedLogWebhook = fetchLogWebhooks.find((wh) => wh.id === logWebhookID);

            const viewEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.user.username}${interaction.user.discriminator == 0 ? "" : `#${interaction.user.discriminator}`}`,
                    iconURL: interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                })
                .setDescription(`Use the \`/log-config-edit\` command to edit configurations.`)
                .addFields(
                    { name: 'Message Logs', value: `<#${data.msglogid || '???'}> (${fetchedLogWebhook ? fetchedLogWebhook.name : '???'})`, inline: false },
                    { name: 'Ignored Categories', value: ignoredCategoryList.join(', ') ? ignoredCategoryList.join(', ') : 'None', inline: true },
                    { name: 'Ignored Channels', value: ignoredChannelList.join(', ') ? ignoredChannelList.join(', ') : 'None', inline: true },
                )
                .setColor('#3838FC')

            await interaction.reply({ embeds: [viewEmbed] });
        });
    },
};