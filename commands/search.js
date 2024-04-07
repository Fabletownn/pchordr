const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Will search for a member with specific username queries')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('name')
            .setDescription('What username do you want to search for?')
            .setRequired(true)
        ),

    async execute(interaction) {
        const name = interaction.options.getString('name');

        let fetchUsers = await interaction.client.guilds.cache.get(interaction.guild.id).members.search({ query: name, limit: 20, cache: false });
        let resultTags = fetchUsers.map((m) => `${m.user} `);
        let results = fetchUsers.map((m) => `${m.user.tag} | ${m.user.id} | Created ${m.user.createdAt}`).join('\n');

        await interaction.reply(`Members with the username query \`${name}\` have been listed (/20).\n\nResults: Found ${resultTags || 'None.'}\n\`\`\`fix\n${results || `None`}\`\`\``);
    },
};