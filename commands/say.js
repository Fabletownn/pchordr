const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Sends a message in a specified channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('What channel do you want to send the message in?')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('content')
                .setDescription('What do you want the bot to send? (do "\\n" for new line)')
                .setRequired(true)
        )
        .addAttachmentOption((option) =>
            option.setName('attachment')
                .setDescription('Do you want any attachments alongside the message?')
                .setRequired(false)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.get('content').value.replace(/\\n/g, `\n`);

        const attachment = interaction.options.getAttachment('attachment');

        if (attachment) {
            await channel.send({ content: message, files: [attachment.url] }).then((sent) => interaction.reply({ content: `Sent bot message in ${channel} with **${sent.attachments.size} attachment(s)**. <:bITFVictory:1063265610303295619>` }));
        } else if (!attachment) {
            await channel.send({ content: message }).then(() => interaction.reply({ content: `Sent bot message in ${channel} with **no attachments**. <:bITFVictory:1063265610303295619>` }));
        }
    },
};