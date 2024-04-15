const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('react')
        .setDescription('Reacts on a message with the specified emote')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('message-link')
                .setDescription('What is the post\'s message link?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('emote')
                .setDescription(`(For multiple separate with spaces) Emote(s) to react with`)
                .setRequired(true)
        ),
    async execute(interaction) {
        const messageLink = interaction.options.getString('message-link');

        const channelID = messageLink.split('/')[5];
        const messageID = messageLink.split('/')[6];

        const emoji = interaction.options.getString('emote');
        const emojiArray = emoji.split(' ');

        let emojiCounter = 0;
        let failCounter = 0;

        if (!channelID || !messageID) return interaction.reply({ content: 'That message link is not valid. <:bITFSweat:1022548683176284281>' });

        await interaction.client.channels.cache.get(channelID).messages.fetch(messageID).then(async (messageFound) => {
            await interaction.deferReply();

            for (const iemoji in emojiArray) {
                await messageFound.react(emojiArray[iemoji]).catch(() => { return failCounter++ }).then(() => emojiCounter++);
            }

            await interaction.followUp({ content: `Reacted with **${emojiCounter - failCounter} emotes** on the [specified post](<${messageFound.url}>)${(failCounter > 0) ? `, with **${failCounter}** emotes failing to be reacted.` : '.'} <:bITFAYAYA:1022548602255589486>` });
        }).catch(() => {
            return interaction.followUp({ content: `Failed to append reaction on the post. Ensure the emoji, channel and message is valid.` });
        });
    },
};