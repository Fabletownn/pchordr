const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Reacts on the specified post with upvote/downvote reactions')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('message-link')
                .setDescription('What is the post\'s message link?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('neutral')
                .setDescription('Do you want a neutral option added?')
                .setRequired(true)
                .addChoices({
                    name: 'Yes',
                    value: 'yes_neutral'
                }, {
                    name: 'No',
                    value: 'no_neutral'
                },
                )
        ),
    async execute(interaction) {
        const messageLink = interaction.options.getString('message-link');
        const neutralOption = interaction.options.get('neutral').value;

        const channelID = messageLink.split('/')[5];
        const messageID = messageLink.split('/')[6];

        await interaction.client.channels.cache.get(channelID).messages.fetch(messageID).then(async (messageFound) => {
            if (!messageFound) return interaction.reply({ content: 'Failed to find the message for that link. <:bITFSweat:1022548683176284281>' });

            await messageFound.react('<:aITFUpvote:1022548599697051790>');
            if (neutralOption === 'yes_neutral') await messageFound.react('<:bITFThink:1022548686158442537>');
            await messageFound.react('<:aITFDownvote:1022548597390180382>');

            await interaction.reply({ content: `Voted up${(neutralOption === 'yes_neutral' ? '/neutral/' : '/')}down on the [specified post](<${messageFound.url}>) successfully.` });
        });
    },
};