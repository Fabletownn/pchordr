const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Will search for members with a specific search query')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption((option) =>
            option.setName('query')
                .setDescription('The username query to search for')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName('limit')
                .setDescription('The maximum amount of searches to return with')
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(50)
        ),
    async execute(interaction) {
        const queryOption = interaction.options.getString('query');
        const limitOption = interaction.options.getInteger('limit') || 15;

        const userFetch = await interaction.client.guilds.cache.get(interaction.guild.id).members.search({ query: queryOption, limit: limitOption, cache: false });
        const resultTags = userFetch.map((m) => ` ${m.user}`);
        const fetchedResults = userFetch.map((m) => `${m.user.username} | ${m.user.id} | Created ${m.user.createdAt}`).join('\n');

        if (fetchedResults) {
            if (userFetch.size === 1) {
                userFetch.map(async (m) => {
                    await interaction.deferReply();

                    const createdDateTS = Math.round(m.user.createdTimestamp / 1000);
                    const joinDateTS = Math.round(m.joinedTimestamp / 1000);

                    const infoEmbed = new EmbedBuilder()
                        .setAuthor({
                            name: `${m.user.username} (${m.displayName || m.user.displayName})`,
                            iconURL: m.user.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .addFields([
                            {
                                name: 'User ID',
                                value: m.user.id,
                                inline: true
                            },
                            {
                                name: 'Mention',
                                value: '<@' + m.user.id + '>',
                                inline: true
                            },
                            {
                                name: '\u200b',
                                value: '\u200b',
                                inline: true
                            },
                            {
                                name: 'Created',
                                value: '<t:' + createdDateTS + ':F>',
                                inline: true
                            },
                            {
                                name: 'Joined',
                                value: '<t:' + joinDateTS + ':F>',
                                inline: true
                            },
                        ]);

                    await interaction.followUp({ content: `One result found. Showing information for **${m.user.username}**.`, embeds: [infoEmbed] });
                });
            } else if (userFetch.size > 1) {
                const fResults = `Fetched:${resultTags || ' None.'}\n\`\`\`fix\n${fetchedResults || 'None'}\`\`\``;

                await interaction.deferReply();

                if (fResults.length < 1500) {
                    interaction.followUp({ content: `Members matching the username query \`${queryOption}\` have been listed (${userFetch.size}/${limitOption.toString()}).\n${fResults}` });
                }
                else {
                    interaction.followUp({ content: 'There were too many results! Please try and narrow your search query.' });
                }
            }
        } else {
            await interaction.reply({ content: `No results found for \`${queryOption}\`.` });
        }
    },
};