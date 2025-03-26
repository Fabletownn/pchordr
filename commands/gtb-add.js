const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GTB = require('../models/gtb.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-add')
        .setDescription('Guess The Blank: Add a new round with new round information')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addStringOption((option) =>
            option.setName('answer')
                .setDescription('The answer for this Guess The Blank image')
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(30)
        )
        .addAttachmentOption((option) =>
            option.setName('image')
                .setDescription('The image for this Guess The Blank round')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('round-override')
                .setDescription('If you need to override details for a specific round, the round number')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(20)
        ),
    async execute(interaction) {
        const gtbAnswer = interaction.options.getString('answer');
        const gtbImage = interaction.options.getAttachment('image');
        const gtbOverride = interaction.options.getInteger('round-override')?.toString() || null;

        const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
        if (!gtbData) return interaction.reply({ content: 'There is no Guess The Blank data set up yet. Run the `/gtb-setup` command to get started.' });

        const gtbMap = gtbData.rounds;

        const gtbCurrRounds = gtbMap.size;
        const gtbNewRound = (gtbCurrRounds + 1).toString();
        const addArray = [gtbAnswer, gtbImage.url];

        await gtbMap.set((gtbOverride ? gtbOverride : gtbNewRound), addArray);

        gtbData.rounds = gtbMap;
        gtbData.save().catch((err) => console.log(err));

        await interaction.reply({ content: `<:bITFCool:1022548621360635994> Set the following information for **Round #${gtbOverride ? gtbOverride : gtbNewRound}** of Guess The Blank: **[${gtbAnswer}](${gtbImage.url})**` });
    },
};