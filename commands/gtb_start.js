const GTB = require('../models/gtb.js');
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
        .setName('gtb-start')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Starts a Guess the Blank game')
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        GTB.findOne({

            guildID: interaction.guild.id,

        }, async (err, data) => {

            if (err) return interaction.editReply({ content: 'An unknown issue came up and I could not view GTB. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.editReply({ content: 'Could not view GTB values since data hasn\'t been set up yet. Use the `/gtb-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            const gtbRounds = [data.round1, data.round2, data.round3, data.round4, data.round5, data.round6, data.round7, data.round8, data.round9, data.round10, data.round11, data.round12, data.round13, data.round14, data.round15, data.round16, data.round17, data.round18, data.round19, data.round20];
            let roundNumber = 1;

            for (const roundInfo of gtbRounds) {

                if (roundInfo === undefined) {

                    interaction.editReply({ content: 'Failed to start a game. Not all rounds have answers and images set; view settings using the `/gtb-view` command.\n\nCheck the following setting: Round #' + roundNumber });

                    break;

                }

                if (!roundInfo[0] || !roundInfo[1]) {

                    interaction.editReply({ content: 'Failed to start a game. Not all rounds have answers and images set; view settings using the `/gtb-view` command.\n\nCheck the following setting: Round #' + roundNumber });

                    break;

                }

                roundNumber++;

            }

            if (roundNumber === 21) {

                console.log('CALLED');

                const gameStartingLine = `Chat has been locked as Guess The Blank begins in 20 seconds. Get those fingers ready! <:bITFGaming:1022548630948810752>\nYour answers do not have to be perfect. Using punctuation, spaces and/or capitals will not mess up your answers.\n\nPlayers with the **Guess The Blank Champion** role may still participate; however, points will not be awarded to said player if answered correctly.\nConnection speeds may affect how you may see answers being clocked in. Those that are marked correct is what the bot deems to be "first" and "last".\n\n***For speed reasons, the URLs will be posted in chat instead of the file. If not already, please go over to User Settings > Text & Images > Show Website Preview Info From Links Pasted In Chat: ON***\n\nIf you feel as if you deserved a point for an answer that did not get marked correct, you are free to ask a staff member to manually grant points to you.\n_ _`;

                await interaction.editReply({ content: gameStartingLine });
                await lockChat(interaction);

                setTimeout(async () => {

                    await playRound(interaction, data);

                }, 5000);

            }

        });

    },

};

var roundsPlayed = 1;

async function playRound(interaction, data) {

    if (roundsPlayed === 21) return interaction.channel.send({ content: `This game of **Guess The Blank** has ended! To ensure this game was monitored by a staff member, one can run the \`/gtb-end\` command. <:bITFGG:1022548636481114172>` });

    unlockChat(interaction);
    
    await interaction.channel.send({ content: `<:bITFThink:1022548686158442537> **Round #${roundsPlayed}**: What do you see?` });

    var collectorFilter;
    var currentAnswer;

    switch (roundsPlayed) {

        case 1:

            await interaction.channel.send({ content: data.round1[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round1[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round1[0];

            break;

        case 2:

            await interaction.channel.send({ content: data.round2[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round2[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round2[0];

            break;

        case 3:

            await interaction.channel.send({ content: data.round3[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round3[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round3[0];

            break;

        case 4:

            await interaction.channel.send({ content: data.round4[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round4[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round4[0];

            break;

        case 5:

            await interaction.channel.send({ content: data.round5[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round5[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round5[0];

            break;

        case 6:

            await interaction.channel.send({ content: data.round6[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round6[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round6[0];

            break;

        case 7:

            await interaction.channel.send({ content: data.round7[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round7[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round7[0];

            break;

        case 8:

            await interaction.channel.send({ content: data.round8[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round8[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round8[0];

            break;

        case 9:

            await interaction.channel.send({ content: data.round9[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round9[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round9[0];

            break;

        case 10:

            await interaction.channel.send({ content: data.round10[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round10[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round10[0];

            break;

        case 11:

            await interaction.channel.send({ content: data.round11[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round11[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round11[0];

            break;

        case 12:

            await interaction.channel.send({ content: data.round12[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round12[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round12[0];

            break;

        case 13:

            await interaction.channel.send({ content: data.round13[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round13[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round13[0];

            break;

        case 14:

            await interaction.channel.send({ content: data.round14[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round14[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round14[0];

            break;

        case 15:

            await interaction.channel.send({ content: data.round15[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round15[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round15[0];

            break;

        case 16:

            await interaction.channel.send({ content: data.round16[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round16[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round16[0];

            break;

        case 17:

            await interaction.channel.send({ content: data.round17[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round17[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round17[0];

            break;

        case 18:

            await interaction.channel.send({ content: data.round18[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round18[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round18[0];

            break;

        case 19:

            await interaction.channel.send({ content: data.round19[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round19[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round19[0];

            break;

        case 20:

            await interaction.channel.send({ content: data.round20[1] });

            collectorFilter = m => !m.author.bot && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(data.round20[0].toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
            currentAnswer = data.round20[0];

            break;

        default:

            break;

    }

    const messageCollector = interaction.channel.createMessageCollector({ filter: collectorFilter, max: 2, time: 6000000 });

    messageCollector.on('end', async (collected) => {

        const firstPlayer = collected.first().author;
        const lastPlayer = collected.last().author;

        if (firstPlayer.id !== lastPlayer.id) {

            POINTS.findOne({

                guildID: interaction.guild.id,
                userID: firstPlayer.id

            }, async (pErr, pData) => {

                if (pErr) return console.log(pErr);

                if (!pData) {

                    const newPointsData = new POINTS({
                        guildID: interaction.guild.id,
                        userID: firstPlayer.id,
                        name: firstPlayer.username,
                        points: 1,
                        lb: 'all'
                    });

                    await newPointsData.save().catch((err) => console.log(err));

                } else {

                    pData.points += 1;
                    await pData.save().catch((err) => console.log(err));

                }

            });

            POINTS.findOne({

                guildID: interaction.guild.id,
                userID: lastPlayer.id

            }, async (pErr, pData) => {

                if (pErr) return console.log(pErr);

                if (!pData) {

                    const newPointsData = new POINTS({
                        guildID: interaction.guild.id,
                        userID: lastPlayer.id,
                        name: lastPlayer.username,
                        points: 1,
                        lb: 'all'
                    });

                    await newPointsData.save().catch((err) => console.log(err));

                } else {

                    pData.points += 1;
                    await pData.save().catch((err) => console.log(err));

                }

            });

            await collected.first().channel.send(`**Correct!** The answer was **${currentAnswer}**. <:bITFCool:1022548621360635994>\n\nPlayers <@${firstPlayer.id}> and <@${lastPlayer.id}> have been awarded 1 point.`);

            await lockChat(interaction);

            setTimeout(async () => await playRound(interaction, data), 3000);

        }

    });

    roundsPlayed++;

}

async function lockChat(interaction) {

    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {

        SendMessages: false,

    }, `GTB Game per @${interaction.user.username}`);

}

async function unlockChat(interaction) {

    await interaction.channel.permissionOverwrites.edit(interaction.guild.id, {

        SendMessages: true,

    }, `GTB Game per @${interaction.user.username}`);

}