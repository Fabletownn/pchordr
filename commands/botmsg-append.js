const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botmsg-append')
        .setDescription('Edits a message to add a string to the end of a bot message')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('message-link')
                .setDescription('What is the post\'s message link?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('content')
                .setDescription('What content do you want added to the end of the message? \\n = new line')
                .setRequired(true)
        ),
    async execute(interaction) {
        const messageLink = interaction.options.getString('message-link');

        const channelID = messageLink.split('/')[5];
        const messageID = messageLink.split('/')[6];

        if (!channelID || !messageID) return interaction.reply({ content: 'That message link is not valid. <:bITFSweat:1022548683176284281>' });

        const appendedContent = interaction.options.getString('content').replace(/\\n/g, `\n`);

        await interaction.client.channels.cache.get(channelID).messages.fetch(messageID).then(async (messageFound) => {
            if (!messageFound) return interaction.reply({ content: 'Message not found!' });
            if (messageFound.author.id !== interaction.client.user.id) return interaction.reply({ content: `Failed to edit message as it doesn't belong to me. This command is designated for editing Power Chord messages, often for announcements or posts.` });

            await messageFound.edit({ content: `${messageFound} ${appendedContent}` }).then(async () => await interaction.reply({ content: `Edited the message (**[jump here](<${messageFound.url}>)**) to end with '${appendedContent.replace(/\n/g, `..`)}'.` }));

        }).catch(() => interaction.reply({ content: 'Failed to edit the post. Ensure it\'s valid and in the proper channel.' }));
    },
};