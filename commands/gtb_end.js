const POINTS = require('../models/points-lb.js');
const CONFIG = require('../models/config.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    AllowedMentionsTypes,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-end')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Ends a finished Guess The Blank game')
        .setDMPermission(false),

    async execute(interaction) {

        CONFIG.findOne({

            guildID: interaction.guild.id

        }, async (cErr, cData) => {

            if (cErr) return console.log(cErr);
            if (!cData) return interaction.reply({ content: `Failed to end a game as there is no configuration data.` });
            if (cData.gtbRole === null) return interaction.reply({ content: `Failed to end a game as there is no configuration data for the Guess The Blank Champion role (winner role).` });

            let participants = [];

            await interaction.reply({ content: `This **Guess The Blank** game has ended! Thanks for playing, and congratulations to the winners!\n_ _` });

            POINTS.find({

                guildID: interaction.guild.id

            }, async (err, data) => {

                if (err) return interaction.editReply({ content: 'An unknown issue came up and I could not handle GTB. <:bITFSweat:1022548683176284281>', ephemeral: true });

                if (!data) return interaction.editReply({ content: 'Failed to end the game as there is no game data.' });

                for (var i = 0; i < data.length; i++) {

                    if (!(participants.some((v) => data[i].userID.includes(v)))) {

                        participants.push(data[i].userID);

                    }

                }

                participants.forEach((participant) => {

                    POINTS.findOne({

                        guildID: interaction.guild.id,
                        userID: participant

                    }, async (pErr, pData) => {

                        if (pErr) return console.log(pErr);

                        if (!pData) return;

                        if (pData.points >= 3) {

                            let pArrayIndex = participants.indexOf(participant);

                            await interaction.client.guilds.cache.get(interaction.guild.id).members.cache.get(participant).roles.add(cData.gtbRole).catch((err) => console.log(`Failed to provide player ${participant} with the role because of an error.\n${err}`));

                            await interaction.channel.send({ content: `Congratulations to <@${participant}> for winning the <@&${cData.gtbRole}> role! (total score: **${pData.points} points**)`, allowedMentions: { parse: [] } });

                            await pData.delete().then(() => participants.splice(pArrayIndex, 1).then(() => interaction.channel.send('REMOVED <@' + participant + '>')));

                        }

                    });

                });

            });

        });

    },

};