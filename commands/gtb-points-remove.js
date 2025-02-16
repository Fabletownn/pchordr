const POINTS = require('../models/points-lb.js');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-points-remove')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Removes points for Guess The Blank from a server member')
        .addUserOption((option) =>
            option.setName('member')
                .setDescription('Who would you like to remove points from?')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('amount')
                .setDescription('How many points would you like to remove from this user? 1 answer = 1 point')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(99)
        ),
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const pointsAdd = interaction.options.getInteger('amount');

        await interaction.deferReply();

        POINTS.findOne({
            guildID: interaction.guild.id,
            userID: member.user.id
        }, async (err, data) => {
            if (err) return interaction.editReply({ content: 'An unknown issue came up and I could not handle GTB. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.editReply({ content: `There are no points to remove from that user.` });

            if (data.points - pointsAdd <= -1) {
                data.points = 0;
                await data.save().catch((err) => console.log(err));

                await interaction.editReply({ content: `Removed **${pointsAdd} points** from ${member}. They now have a total of **0 points**.`, allowedMentions: { parse: [] } });
            } else {
                data.points -= pointsAdd;
                await data.save().catch((err) => console.log(err));

                await interaction.editReply({ content: `Removed **${pointsAdd} points** from ${member}. They now have a total of **${data.points} points**.`, allowedMentions: { parse: [] } });
            }
        });
    },
};