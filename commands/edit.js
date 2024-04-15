const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botmsg-edit')
        .setDescription('Edits a specified message sent by Power Chord')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('message-link')
            .setDescription('What is the post\'s message link?')
            .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('content')
            .setDescription('What do you want the edited message to say? \n = new line')
            .setRequired(true)
        ),
    async execute(interaction) {
        const messageLink = interaction.options.getString('message-link');

        const channelID = messageLink.split('/')[5];
        const messageID = messageLink.split('/')[6];

        if (!channelID || !messageID) return interaction.reply({ content: 'That message link is not valid. <:bITFSweat:1022548683176284281>' });

        const newMessage = interaction.options.getString('content').replace(/\\n/g, `\n`);

        await interaction.client.channels.cache.get(channelID).messages.fetch(messageID).then(async (messageFound) => {
            if (!messageFound) return interaction.reply({ content: 'Failed to find the message corresponding to that link. <:bITFSweat:1022548683176284281>' });
            if (messageFound.author.id !== interaction.client.user.id) return interaction.reply({ content: 'Failed to edit that message, as it does not belong to me. This command is designated for editing Power Chord messages, often for announcements or posts.' });

            messageFound.edit(newMessage).then(async () => await interaction.reply({ content: `Edited the message (**[jump here](<${messageFound.url}>)**) with '${newMessage.replace(/\n/g, `..`)}'.` }));
        }).catch((err) => interaction.reply({ content: `Failed to edit the post (${err}). Ensure it's valid and in the proper channel.` }));
    },
};