const CONFIG = require('../models/config.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-setup')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Sets up initial data for the server or resets it')
        .setDMPermission(false),

    async execute(interaction) {

        CONFIG.findOne({

            guildID: interaction.guild.id,

        }, async (err, data) => {

            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not handle configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });

            if (!data) {

                const newConfigData = new CONFIG({
                    guildID: interaction.guild.id,
                    generalChat: null,
                    modChat: null,
                    serverUpdatesChat: null,
                    pollsChat: null,
                    artChat: null,
                    gpChat: null,
                    supportersChat: null,
                    gtbChat: null,
                    adminRole: null,
                    modRole: null,
                    supportersRole: null,
                    boosterRole: null,
                    ytRole: null,
                    twitchRole: null,
                    gtbRole: null,
                    autopublish: false,
                    vxtwitter: false,
                    artdelete: false,
                    greeting: false
                });

                newConfigData.save().catch((err) => console.log(err));

                await interaction.reply({ content: 'Set up data for the server. Use the `/config-edit` command to edit configuration values. <:bITFVictory:1063265610303295619>' });

            } else if (data) {

                const setupRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('setup-reset')
                        .setEmoji('✅') // 1022548599697051790
                        .setLabel('Reset')
                        .setStyle(ButtonStyle.Success),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('setup-cancel')
                        .setEmoji('❌') // 1022548597390180382
                        .setLabel('Cancel')
                        .setStyle(ButtonStyle.Danger),
                );

                await interaction.reply({ content: 'There is already data set for the server. Reset to default settings? <:bITFSweat:1022548683176284281>', components: [setupRow] });

            }

        });

    },

};