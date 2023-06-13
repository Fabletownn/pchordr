const GTB = require('../models/gtb.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-setup')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Sets up initial data for Guess the Blank or resets it')
        .setDMPermission(false),

    async execute(interaction) {

        GTB.findOne({

            guildID: interaction.guild.id,

        }, async (err, data) => {

            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not handle GTB. <:bITFSweat:1022548683176284281>', ephemeral: true });

            if (!data) {

                const newGTBData = new GTB({
                    guildID: interaction.guild.id,
                    round1: [],
                    round2: [],
                    round3: [],
                    round4: [],
                    round5: [],
                    round6: [],
                    round7: [],
                    round8: [],
                    round9: [],
                    round10: [],
                    round11: [],
                    round12: [],
                    round13: [],
                    round14: [],
                    round15: [],
                    round16: [],
                    round17: [],
                    round18: [],
                    round19: [],
                    round20: []
                });

                newGTBData.save().catch((err) => console.log(err));

                await interaction.reply({ content: 'Set up data for Guess the Blank. Use the `/gtb-add` command to add game values. <:bITFVictory:1063265610303295619>' });

            } else if (data) {

                const setupRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('gtb-reset')
                            .setEmoji('1022548599697051790')
                            .setLabel('Reset')
                            .setStyle(ButtonStyle.Success),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('gtb-reset-cancel')
                            .setEmoji('1022548597390180382')
                            .setLabel('Cancel')
                            .setStyle(ButtonStyle.Danger),
                    );

                await interaction.reply({ content: 'There is already data set for the game. Wipe all image and answer settings? <:bITFSweat:1022548683176284281>', components: [setupRow] });

            }

        });

    },

};