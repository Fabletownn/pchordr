const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const POINTS = require('../models/gtb_leaderboard.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-points')
        .setDescription('Guess The Blank: Add or remove GTB points')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption((option) =>
            option.setName('user')
                .setDescription('The user receiving these points')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('points')
                .setDescription('The amount of points to receive (use negative value to remove)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const points = interaction.options.getInteger('points');
        const pointsData = await POINTS.findOne({ userID: user.id });

        if (points === 0) return interaction.reply({ content: 'The points value must be a negative or positive number!' });

        if (!pointsData) {
            const clampedPoints = Math.max(0, Math.min(points, 50));

            const newPointsData = new POINTS({
                guildID: interaction.guild.id,
                userID: user.id,
                points: clampedPoints
            });

            await newPointsData.save().catch((err) => console.log(err));
            return interaction.reply({ content: `${points < 0 ? `Removed **${points * -1}` : `Added **${points}`} points** to **@${user.username}**'s balance. Their new balance is **${clampedPoints}**.` });
        }

        const clampedPoints = Math.max(0, Math.min(pointsData.points + points, 50));

        pointsData.points = clampedPoints;
        await pointsData.save().catch((err) => console.log(err));
        await interaction.reply({ content: `${points < 0 ? `Removed **${points * -1} points** from` : `Added **${points} points** to`} **@${user.username}**'s balance. Their new balance is **${clampedPoints}**.` });
    },
};