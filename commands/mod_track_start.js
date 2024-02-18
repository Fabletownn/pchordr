const TRACK = require('../models/trackers.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('track start')
        .setDescription('Begins a tracker to keep an eye on a member and logs their every X messages')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false)
        .addUserOption((option) =>
            option.setName('member')
                .setDescription('Who do you want to track?')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('amount')
                .setDescription('How many messages do you want to track until a log is sent? (e.g. every time X messages are sent)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(50)
        )
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('Where do you want the message logs to be sent to?')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),

    async execute(interaction) {

        const trackMember = interaction.options.getMember('member');
        const trackNumber = interaction.options.getInteger('amount');
        const trackChannel = interaction.options.getChannel('channel');

        TRACK.findOne({

            guildID: interaction.guild.id,
            userID: trackMember.user.id

        }, async (err, data) => {

            if (err) return console.log(err);

            if (data) return interaction.reply({ content: `Failed to track that user, as they are already being tracked. Remove a tracker using the \`/track-stop\` command.` });

            const newTracker = new TRACK({
                guildID: interaction.guild.id,
                userID: trackMember.user.id,
                limit: trackNumber,
                channel: trackChannel.id,
                sent: 0,
                log: `(Session #1) Power Chord message tracking log for @${trackMember.user.username} (${trackMember.user.id}) started at ${new Date().toLocaleString().replace(',', '')}..\n\n`,
                session: 0
            });

            await newTracker.save().catch((err) => console.log(err));
            await interaction.reply({ content: `Now tracking <@${trackMember.user.id}> (**@${trackMember.user.username}**) every **${trackNumber} messages**. <:bITFVictory:1063265610303295619>\n\nWhen ${trackNumber} messages are sent from this user, a log will be sent to ${trackChannel}.\n\nTo stop tracking and logging a member's messages, use the \`/track-stop\` command.`, allowedMentions: { parse: [] } });

        });

    },

};