const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('append')
        .setDescription('Edits a message to add a string to the end of a bot message')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addChannelOption((option) =>
            option.setName('channel')
            .setDescription('What channel is the message in?')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('message-id')
            .setDescription('What is the post\'s message ID?')
            .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('content')
            .setDescription('What content do you want added to the end of the message? {indent} = new line')
            .setRequired(true)
        ),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message-id');
        const appendedContent = interaction.options.getString('content').replace(/{indent}\s|{indent}|\s{indent}\s|\s{indent}/g, `\n`);

        interaction.client.channels.cache.get(channel.id).messages.fetch(message).then(async (messageFound) => {
            if (messageFound.author.id !== interaction.client.user.id) return interaction.reply(`Failed to edit message as it doesn't belong to me. This command is designated for editing Power Chord messages, often for announcements or posts.`);

            await messageFound.edit(`${messageFound} ${appendedContent}`).then(async () => await interaction.reply(`Edited the message (**[jump here](<${messageFound.url}>)**) to end with '${appendedContent.replace(/\n/g, `..`)}'.`));

        }).catch((err) => interaction.reply(`Failed to edit the post. Ensure it's valid and in the proper channel.`));
    },
};