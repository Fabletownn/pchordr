const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botmsg-replicate')
        .setDescription('Replicates a message\'s content in a specified channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('What channel do you want to replicate this message to?')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('message-link')
                .setDescription('What is the post you want to replicate\'s message link?')
                .setRequired(true)
        ),
    async execute(interaction) {
        const channelOption = interaction.options.getChannel('channel');
        const messageLink = interaction.options.getString('message-link');

        const channelID = messageLink.split('/')[5];
        const messageID = messageLink.split('/')[6];

        if (!channelID || !messageID) return interaction.reply({ content: 'That message link is not valid. <:bITFSweat:1022548683176284281>' });

        await interaction.client.channels.cache.get(channelID).messages.fetch(messageID).then(async (messageFound) => {
            if (!messageFound) return interaction.reply({ content: 'Failed to find the message corresponding to that link. <:bITFSweat:1022548683176284281>' });
            if (!messageFound.content) return interaction.reply({ content: 'There is no message contents in that message to replicate. <:bITFSweat:1022548683176284281>' });
            if (messageFound.content.length > 2000) return interaction.reply({ content: `That message is too long for me to replicate (**${messageFound.content.length.toLocaleString()}**/2,000 characters). <:bITFSweat:1022548683176284281>` });
            
            await channelOption.send({ content: messageFound.content });
            await interaction.reply({ content: `Replicated the message from <#${channelID}> to the <#${channelOption.id}> channel successfully. <:bITFTalk:1063265609112100945>`});
        });
    },
};