const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit')
        .setDescription('Edits a specified message sent by Power Chord')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addChannelOption((option) =>
            option.setName('channel')
            .setDescription('What channel is the message in?')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('id')
            .setDescription('What is the post\'s message ID?')
            .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('content')
            .setDescription('What do you want the edited message to say? {indent} = new line')
            .setRequired(true)
        ),

    async execute(interaction) {

        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('id');
        const newMessage = interaction.options.getString('content').replace(/{indent}\s|{indent}|\s{indent}\s|\s{indent}/g, `\n`);

        interaction.client.channels.cache.get(channel.id).messages.fetch(message).then(async (message_found) => {

            if (message_found.author.id !== interaction.client.user.id) return interaction.reply(`Failed to edit that message, as it doesn't belong to me. This command is designated for editing Power Chord messages, often for announcements or posts.`);

            message_found.edit(newMessage).then(async () => await interaction.reply(`Edited the message (**[jump here](<${message_found.url}>)**) with '${newMessage.replace(/\n/g, `..`)}'.`));

        }).catch((err) => interaction.reply(`Failed to edit the post (${err}). Ensure it's valid and in the proper channel.`));

    },
};