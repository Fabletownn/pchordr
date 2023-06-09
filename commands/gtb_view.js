const GTB = require('../models/gtb.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    AllowedMentionsTypes,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-view')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Views Guess the Blank\'s answer settings')
        .setDMPermission(false),

    async execute(interaction) {

        await interaction.deferReply();

        const gtbEmbed = new EmbedBuilder()
            .setAuthor({ name: 'Guess The Blank Answers', iconURL: interaction.guild.iconURL({ dynamic: true }) })

        GTB.findOne({

            guildID: interaction.guild.id,

        }, async (err, data) => {

            if (err) return interaction.editReply({ content: 'An unknown issue came up and I could not view GTB. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.editReply({ content: 'Could not view GTB values since data hasn\'t been set up yet. Use the `/gtb-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            const gtbRounds = [data.round1, data.round2, data.round3, data.round4, data.round5, data.round6, data.round7, data.round8, data.round9, data.round10, data.round11, data.round12, data.round13, data.round14, data.round15, data.round16, data.round17, data.round18, data.round19, data.round20];
            let roundNumber = 0;

            for (const roundInfo of gtbRounds) {

                if ((roundInfo === undefined) || (roundInfo.length == 0)) {

                    roundInformation = 'None';
                    roundNumber++;

                    gtbEmbed.addFields([
                        { name: `Round ${roundNumber}`, value: `None`, inline: true }
                    ]);

                } else if ((roundInfo !== undefined) && (roundInfo.length > 0)) {

                    roundNumber++;

                    gtbEmbed.addFields([
                        { name: `Round ${roundNumber}`, value: `**[${roundInfo[0]}](${roundInfo[1]})**`, inline: true }
                    ]);

                }

            }

            gtbEmbed.addFields([
                { name: `\u200b`, value: `\u200b`, inline: true }
            ]);

            await interaction.editReply({ embeds: [gtbEmbed] });

        });

    },

};