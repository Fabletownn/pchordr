const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('react')
        .setDescription('Reacts on a message with the specified emote')
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
            option.setName('emote')
                .setDescription(`What emote do you want me to react with?`)
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('id');
        const emoji = interaction.options.getString('emote');

        await interaction.client.channels.cache.get(channel.id).messages.fetch(message).then(async (message_found) => {
            await message_found.react(emoji).then(() => interaction.reply(`Reacted '${emoji}' on the specified post (**[jump here](<${message_found.url}>)**).`)).catch((err) => {
                return interaction.reply(`Failed to append reaction on the post. Ensure the emoji, channel and message is valid.`)
            });
        }).catch((err) => {
            interaction.reply(`Failed to append reaction on the post. Ensure the emoji, channel and message is valid.`)

            return console.log(err);
        });
    },
};