const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Provides the profile picture of a member or the command executor')
        .addUserOption((option) =>
            option.setName('member')
                .setDescription('Who would you like to see the profile picture of? (ID or mention)')
        ),
    async execute(interaction) {
        const user = interaction.options.getMember('member');

        if (user) {
            if (!interaction.guild.members.cache.get(user.id)) return interaction.reply({ content: `Failed to fetch that member's profile picture, as they aren't in the server. <:bITFSweat:1022548683176284281>`, ephemeral: true });

            const avatarEmbed1 = new EmbedBuilder()
                .setTitle(`${user.displayName}'s Avatar`)
                .setColor(user.displayColor)
                .setImage(user.displayAvatarURL({
                    dynamic: true,
                    size: 1024
                }));

            return interaction.reply({ content: null, embeds: [avatarEmbed1] });
        }

        const avatarEmbed2 = new EmbedBuilder()
            .setTitle(`${interaction.member.displayName}'s Avatar`)
            .setColor(interaction.member.displayColor)
            .setImage(interaction.user.displayAvatarURL({
                dynamic: true,
                size: 1024
            }));

        return interaction.reply({ content: null, embeds: [avatarEmbed2] });
    },
};