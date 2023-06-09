const TRACK = require('../models/trackers.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('track-stop')
        .setDescription('Stops a message tracker on a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((option) =>
            option.setName('member')
                .setDescription('Who do you no longer want to track?')
                .setRequired(true)
        )
        .setDMPermission(false),

    async execute(interaction) {

        const trackMember = interaction.options.getMember('member');

        TRACK.findOne({

            guildID: interaction.guild.id,
            userID: trackMember.user.id

        }, async (err, data) => {

            if (err) return console.log(err);

            if (!data) return interaction.reply({ content: `Failed to remove that tracker, as they are not being tracked. Add a tracker using the \`/track-start\` command.` });

            const confMessage = `Any messages sent from <@${data.userID}> will no longer be tracked and logged to <#${data.channel}>. <:bITFVictory:1063265610303295619>`;

            await data.delete();
            await interaction.reply({ content: confMessage, allowedMentions: { parse: [] } });

        });

    },

};