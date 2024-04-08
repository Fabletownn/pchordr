const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botmsg-replace')
        .setDescription('Replaces a specific portion of a bot message with the given values')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('message-link')
            .setDescription('What is the post\'s message link?')
            .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('old')
            .setDescription('What would you like to replace? (case-sensitive)')
            .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('new')
            .setDescription('What should the old portion be replaced with?')
            .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('method')
            .setDescription('Which method would you like to replace it in?')
            .setRequired(true)
            .addChoices({
                name: 'First Instance',
                value: 'first_instance'
            }, {
                name: 'Every Instance',
                value: 'every_instance'
            }, {
                name: 'Last Instance',
                value: 'last_instance'
            }, )
        ),
    async execute(interaction) {
        const messageLink = interaction.options.getString('message-link');

        const channelID = messageLink.split('/')[5];
        const messageID = messageLink.split('/')[6];

        if (!channelID || !messageID) return interaction.reply({ content: 'That message link is not valid. <:bITFSweat:1022548683176284281>' });

        const toReplace = interaction.options.getString('old');
        const replaceWith = interaction.options.getString('new');
        const instance = interaction.options.get('method').value;

        let newMessage;

        interaction.client.channels.cache.get(channelID).messages.fetch(messageID).then(async (messageFound) => {
            if (messageFound.author.id !== interaction.client.user.id) return interaction.reply(`Failed to edit message as it doesn't belong to me. This command is designated for editing Power Chord messages, often for announcements or posts.`);
            if (!messageFound.content.includes(toReplace)) return interaction.reply(`Failed to replace. Couldn't find '${toReplace}' anywhere within the requested message.`);

            if (instance === 'first_instance') {
                newMessage = messageFound.content.replace(toReplace, replaceWith);

                messageFound.edit(newMessage);

                return interaction.reply(`Edited the message (**[jump here](<${messageFound.url}>)**) replacing '${toReplace}' with '${replaceWith}' using the first instance only.`);
            } else

            if (instance === 'every_instance') {
                newMessage = messageFound.content.replaceAll(toReplace, replaceWith);

                await messageFound.edit(newMessage);

                return interaction.reply(`Edited the message (**[jump here](<${messageFound.url}>)**) replacing '${toReplace}' with '${replaceWith}' using every instance.`);
            } else

            if (instance === 'last_instance') {
                let lastIndex = messageFound.content.lastIndexOf(toReplace);

                newMessage = messageFound.content.slice(0, lastIndex) + messageFound.content.slice(lastIndex).replace(toReplace, replaceWith);

                await messageFound.edit(newMessage);

                return interaction.reply(`Edited the message (**[jump here](<${messageFound.url}>)**) replacing '${toReplace}' with '${replaceWith}' using just the last instance.`);
            }
        }).catch((err) => interaction.reply(`Failed to edit the post. Ensure it's valid and in the proper channel.`));
    },
};