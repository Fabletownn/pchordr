const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GTB = require('../models/gtb.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-add')
        .setDescription('Adds answers and images for Guess the Blank rounds')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addIntegerOption((option) =>
            option.setName('round-number')
                .setDescription('What round number will these show up during the game?')
                .setRequired(true)
                .setMaxValue(20)
                .setMinValue(1),
        )
        .addStringOption((option) =>
            option.setName('answer')
                .setDescription('What is the answer for the round image? (only letters/numbers will be read)')
                .setRequired(true)
        )
        .addAttachmentOption((option) =>
            option.setName('image')
                .setDescription('What image corresponds to the answer for the question?')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const roundNumber = interaction.options.getInteger('round-number');
        const roundAnswer = interaction.options.getString('answer');
        const roundImage = interaction.options.getAttachment('image');
        const imageName = roundImage.name.toLowerCase();

        if ((!imageName.endsWith('.png')) && (!imageName.endsWith('.jpg')) && !imageName.endsWith('.jpeg')) return interaction.editReply({ content: `Failed to set that information. The file type is not allowed, and only \`.png\`, \`.jpg\`, and \`.jpeg\` extensions can be used for Guess the Blank. ${imageName}` });

        await createGTBData(interaction, roundNumber, roundAnswer, roundImage.url);
    },
};

async function createGTBData(interaction, roundNumber, roundAnswer, roundImage) {
    GTB.findOne({
        guildID: interaction.guild.id
    }, async (err, data) => {
        if (err) return console.log(err);
        if (!data) return interaction.editReply({ content: `Failed to set that information, as Guess the Blank hasn't been set up yet. Use the \`/gtb-setup\` command to get started, or reset data for future needs.` });

        const dataResponse = `Saved game information for **Round #${roundNumber}**. Use the \`/gtb-view\` command to see all set answers. <:bITFVictory:1063265610303295619>\n\nAnswer: **${roundAnswer}**\nImage: **<${roundImage}>**\n\nNote: In-game, all answers will be stripped of all their characters other than letters and numbers. This means that if your answer is something like "Guess-The-Blank-01", the game will check for "guesstheblank01" instead.`;

        switch (roundNumber) {
            case 1:
                data.round1 = [];

                await data.round1.push(roundAnswer);
                await data.round1.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 2:
                data.round2 = [];

                await data.round2.push(roundAnswer);
                await data.round2.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 3:
                data.round3 = [];

                await data.round3.push(roundAnswer);
                await data.round3.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 4:
                data.round4 = [];

                await data.round4.push(roundAnswer);
                await data.round4.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 5:
                data.round5 = [];

                await data.round5.push(roundAnswer);
                await data.round5.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 6:
                data.round6 = [];

                await data.round6.push(roundAnswer);
                await data.round6.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 7:
                data.round7 = [];

                await data.round7.push(roundAnswer);
                await data.round7.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 8:
                data.round8 = [];

                await data.round8.push(roundAnswer);
                await data.round8.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 9:
                data.round9 = [];

                await data.round9.push(roundAnswer);
                await data.round9.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 10:
                data.round10 = [];

                await data.round10.push(roundAnswer);
                await data.round10.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 11:
                data.round11 = [];

                await data.round11.push(roundAnswer);
                await data.round11.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 12:
                data.round12 = [];

                await data.round12.push(roundAnswer);
                await data.round12.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 13:
                data.round13 = [];

                await data.round13.push(roundAnswer);
                await data.round13.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 14:
                data.round14 = [];

                await data.round14.push(roundAnswer);
                await data.round14.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 15:
                data.round15 = [];

                await data.round15.push(roundAnswer);
                await data.round15.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 16:
                data.round16 = [];

                await data.round16.push(roundAnswer);
                await data.round16.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 17:
                data.round17 = [];

                await data.round17.push(roundAnswer);
                await data.round17.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 18:
                data.round18 = [];

                await data.round18.push(roundAnswer);
                await data.round18.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 19:
                data.round19 = [];

                await data.round19.push(roundAnswer);
                await data.round19.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            case 20:
                data.round20 = [];

                await data.round20.push(roundAnswer);
                await data.round20.push(roundImage);

                await data.save().catch((err) => console.log(err));
                await interaction.editReply({ content: dataResponse });

                break;
            default:
                await interaction.editReply({ content: 'Failed to set that information. Round number invalid.' });
                break;
        }
    });
}