const POINTS = require('../models/points-lb.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    AllowedMentionsTypes,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-points-add')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Adds points for Guess The Blank to a server member')
        .setDMPermission(false)
        .addUserOption((option) =>
            option.setName('member')
                .setDescription('Who would you like to award points to?')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('amount')
                .setDescription('How many points would you like to award this user? 1 answer = 1 point')
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

            if (!data) {
                const newPointsData = new POINTS({
                    guildID: interaction.guild.id,
                    userID: member.user.id,
                    name: member.user.username,
                    points: pointsAdd,
                    lb: 'all'
                });

                await newPointsData.save().catch((err) => console.log(err));
                await interaction.editReply({ content: `Added **${pointsAdd} points** to ${member}. They now have a total of **${pointsAdd} points**.`, allowedMentions: { parse: [] } });
            } else {
                data.points += pointsAdd;
                await data.save().catch((err) => console.log(err));

                await interaction.editReply({ content: `Added **${pointsAdd} points** to ${member}. They now have a total of **${data.points} points**.`, allowedMentions: { parse: [] } });
            }
        });
    },
};