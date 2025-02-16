const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Creates a custom embed and sends to the specified channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('Specified channel to send the embed in?')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        )
        .addStringOption((option) =>
            option.setName('title')
                .setDescription('What would you like the title to be?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('description')
                .setDescription('What would you like the description to be? (use \\n for a new line)')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('footer')
                .setDescription('What would you like the footer to be?')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('color')
                .setDescription('What would you like the color to be?')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('message')
                .setDescription('What would you like the message outside of the embed to be?')
                .setRequired(false)
        )
        .addAttachmentOption((option) =>
            option.setName('attachment')
                .setDescription('What attachments would you like to add?')
                .setRequired(false)
        ),

    async execute(interaction) {
        const optionChannel = interaction.options.getChannel('channel');
        const optionTitle = interaction.options.getString('title');
        const optionDescription = interaction.options.getString('description').replace(/\\n/g, '\n');
        const optionFooter = interaction.options.getString('footer');
        const optionColor = interaction.options.getString('color');
        const optionAttach = interaction.options.getAttachment('attachment');
        const optionMessage = interaction.options.getString('message');

        const customEmbed = new EmbedBuilder();

        customEmbed.setTitle(optionTitle);
        customEmbed.setDescription(optionDescription);
        if (optionColor) customEmbed.setColor(optionColor);
        if (optionAttach) customEmbed.setImage(optionAttach.url);
        if (optionFooter) customEmbed.setFooter({ text: optionFooter });

        await optionChannel.send({ content: optionMessage || null, embeds: [customEmbed] });
        await interaction.reply({ content: `Sent the attached embed in <#${optionChannel.id}> successfully${(optionMessage !== null ? ` with message content attached.` : '.')} <:bITFTalk:1063265609112100945>`, embeds: [customEmbed] });
    },
};