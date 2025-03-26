const { EmbedBuilder } = require('discord.js');
const CONFIG = require('../models/config.js');
const GTB = require('../models/gtb.js');
const POINTS = require('../models/gtb_leaderboard.js');

const gtbWinnerRole = '626803737595478046';
const roundLockSections = 5;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms * 1000));
}

function playersCanSpeak(interaction, canSpeak) {
    interaction.channel.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: canSpeak
    });
}

async function playRound(interaction) {
    // If there is no data, end the game
    const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
    if (!gtbData) return endGame(interaction);

    // Variables
    const rounds = gtbData.rounds;
    const maxRounds = rounds.size;
    const lastRound = gtbData.currRound;
    const currRound = lastRound + 1;
    const winners = [];

    // If the game was abruptly ended or naturally ended, end the game
    if (lastRound < 0) return;
    if (currRound > maxRounds) return endGame(interaction);

    // Set the current round data variable
    gtbData.currRound = currRound;
    await gtbData.save().catch((err) => console.log(err));

    // Get the answer and image to the current round
    const roundAnswer = rounds.get(currRound.toString())[0];
    const roundImage = rounds.get(currRound.toString())[1];

    // Allow players to speak and begin a filter
    await playersCanSpeak(interaction, true);

    // Ensure the player isn't a bot, filter the answer and their message for accuracy, already hasn't gotten the answer
    // correct, and doesn't have the winner role, then begin collecting messages
    const roundFilter = (m) => !m.author.bot
        && m.content.toLowerCase().replace(/[^a-zA-Z0-9]/g, '').startsWith(roundAnswer.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''))
        && !winners.includes(m.author.id)
        && !m.member.roles.cache.has(gtbWinnerRole);
    const msgCollector = await interaction.channel.createMessageCollector({ filter: roundFilter, max: 2, time: 1800000 });

    await interaction.channel.send({ content: `<:bITFThink:1022548686158442537> **[Round #${currRound}](${roundImage})**: What do you see?` });

    await msgCollector.on('collect', async (collected) => {
        const playerCollected = collected.author;
        const playerPoints = await POINTS.findOne({ userID: playerCollected.id });

        // Award players their points for getting the answer correct
        if (!playerPoints) {
            const newPointsData = new POINTS({
                guildID: interaction.guild.id,
                userID: playerCollected.id,
                points: 1
            });

            await newPointsData.save().catch((err) => console.log(err));
        } else {
            playerPoints.points += 1;
            await playerPoints.save().catch((err) => console.log(err));
        }

        // Push the player and the message into an array
        winners.push(playerCollected.id);
    });

    await msgCollector.on('end', async (collected) => {
        const playerOneUID = collected.first().author.id; // Player 1 User ID
        const playerOneMID = collected.first().id;        // Player 1 Message ID
        const playerTwoUID = collected.last().author.id;  // Player 2 User ID
        const playerTwoMID = collected.last().id;         // Player 2 Message ID

        await interaction?.channel?.messages?.fetch(playerOneMID)?.then((m) => m?.react('✅'));
        await interaction?.channel?.messages?.fetch(playerTwoMID)?.then((m) => m?.react('✅'));

        await interaction.channel.send({ content: `The answer was **${roundAnswer}**! Players <@${playerOneUID}> and <@${playerTwoUID}> have been awarded a point.\n_ _` });

        // Close the channel and wait before starting the next round
        await playersCanSpeak(interaction, false);
        await delay(roundLockSections);

        // Play the next round, whether players run out of time or get it right
        await playRound(interaction, gtbData);
    });
}

async function endGame(interaction) {
    const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
    const pointsData = await POINTS.find({ guildID: interaction.guild.id });

    if (!gtbData) return interaction.channel.send({ content: 'No game data found, failed to end the game!' });
    if (!pointsData) return interaction.channel.send({ content: 'No points data found, failed to end the game!' });

    // Reset the current playing round to 0
    gtbData.currRound = -1;
    await gtbData.save().catch((err) => console.log(err));

    // Reward all players with 3 or more points with the GTB Winner role
    for (const data of pointsData) {
        const points = data.points;
        if (points < 3) continue;

        const member = interaction.guild.members.cache.get(data.userID);
        await member?.roles?.add(gtbWinnerRole);
        await interaction.channel.send({ content: `<:bITFVictory:1063265610303295619> Congratulations to <@${data.userID}> for winning the <@&${gtbWinnerRole}> role! (total score: **${points} points**)`, allowedMentions: { parse: [] } });
    }

    const leaderboard = await getLeaderboard(interaction);

    // Tally up the points for the leaderboard and display the results
    await interaction.channel.send({ content: '# Leaderboard', embeds: [leaderboard] });
}

async function getLeaderboard(interaction) {
    const pointsData = await POINTS.find({ guildID: interaction.guild.id });
    if (!pointsData) return;

    const points_array = [];
    const lbEmbed = new EmbedBuilder()
        .setAuthor({ name: 'Guess The Blank Leaderboard', iconURL: 'https://i.imgur.com/CKSNaWS.png' })
        .setFooter({ text: 'I Talk Server' })
        .setColor('#C51BDF')
        .setTimestamp();

    // Loop for pushing all scores into an array and sorting them
    for (let i = 0; i < pointsData.length; i++) {
        if (points_array.length === 10) break; // No more than 10
        points_array.push(pointsData[i].points); // Push points into an array for sorting
    }

    points_array.sort((a, b) => b - a); // Sort from greatest to least

    // Loop for finding and placing players on a leaderboard
    for (let i = 0; i < points_array.length; i++) {
        const playerData = await POINTS.findOne({ guildID: interaction.guild.id, points: points_array[i] });
        if (!playerData) continue;

        const member = interaction.guild.members.cache.get(playerData.userID);
        const icon = (i === 0) ? '🥇': (i === 1) ? '🥈' : (i === 2) ? '🥉' : '';

        lbEmbed.addFields([
            { name: `${i+1}. ${member ? member.displayName : playerData.userID} ${icon}\n`, value: `${playerData.points} points`, inline: false }
        ]);

        await playerData.deleteOne();
    }

    return lbEmbed;
}

module.exports = { playRound, endGame, getLeaderboard, delay, playersCanSpeak };