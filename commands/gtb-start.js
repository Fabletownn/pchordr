const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const GTB = require('../models/gtb.js');
const { playRound, playersCanSpeak, delay } = require('../handlers/gtb_functions.js');

const startLockSeconds = 10;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-start')
        .setDescription('Guess The Blank: Start the game!')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
        if (!gtbData) return interaction.reply({ content: 'There is no Guess The Blank data set up yet. Run the `/gtb-setup` command to get started.' });
        if (gtbData.currRound > 0) return interaction.reply({ content: 'There is a Guess The Blank game currently running! Run the `/gtb-end` command to forcefully end it.' });

        await interaction.deferReply();

        gtbData.currRound = 0;
        await gtbData.save().catch((err) => console.log(err));

        // Game Variables
        const gtbRounds = gtbData.rounds;

        const gtbStarter = `<:bITFCool:1022548621360635994> This channel has been locked as **Guess The Blank** begins in **${startLockSeconds} seconds**! There will be **${gtbRounds.size} rounds** this game.\n\n` +
            `<:bITFCry:1022548623243886593> Your answers do not have to be perfect. Using punctuation, spaces, and capitals will not compromise your chance of winning a round. Staff members may manually award points for those who feel like they deserved it.\n\n` +
            `<:bITFGaming:1022548630948810752> Connection speeds may impact how different players see answers being sent. Answers marked as 'correct' is what the bot registered to have been first and last. Get ready!`;

        // Begin the game, replying to the executor with the GTB starter message
        await interaction.followUp({ content: gtbStarter });

        // Close the channel, wait 10 seconds, and reopen the channel
        await playersCanSpeak(interaction, false);
        await delay(startLockSeconds);

        // Begin the game
        await playRound(interaction);
    },
};
