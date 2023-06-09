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

        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message-id');
        const neutralOption = interaction.options.get('neutral').value;

        switch (neutralOption) {

            case "yes_neutral":

                interaction.client.channels.cache.get(channel.id).messages.fetch(message).then(async (message_found) => {

                    await message_found.react(`<:aITFUpvote:1022548599697051790>`);
                    await message_found.react(`<:bITFThink:1022548686158442537>`);
                    await message_found.react(`<:aITFDownvote:1022548597390180382>`);

                    await interaction.reply(`Voted up/neutral/down on the specified post (**[jump here](<${message_found.url}>)**).`);

                }).catch((err) => {

                    interaction.reply(`Failed to append reactions on the post. Ensure the emoji, channel and message is valid.`)

                    return console.log(err);

                });

                break;

            case "no_neutral":

                interaction.client.channels.cache.get(channel.id).messages.fetch(message).then(async (message_found) => {

                    await message_found.react(`<:aITFUpvote:1022548599697051790>`);
                    await message_found.react(`<:aITFDownvote:1022548597390180382>`);

                    await interaction.reply(`Voted up/down on the specified post (**[jump here](<${message_found.url}>)**).`);

                }).catch((err) => {

                    interaction.reply(`Failed to append reactions on the post. Ensure the emoji, channel and message is valid.`)

                    return console.log(err);

                });

                break;

            default:

                break;

        }


    },
};