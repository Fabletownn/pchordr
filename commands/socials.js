const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('socials')
        .setDescription('Provides I Talk\'s social media links')
        .setDMPermission(false),
    async execute(interaction) {
        const socialLinks = new EmbedBuilder()
            .setAuthor({
                name: `Social Media - I Talk`, iconURL: interaction.guild.iconURL({
                    dynamic: true
                })
            })
            .setDescription(`→ [**YouTube**](http://bit.ly/2Nu6QOG) Channel\n→ [**Let's Play**](https://www.youtube.com/channel/UCkD5h9ZiRxxG556svc8kOzw) Channel\n→ [**Twitch**](https://www.twitch.tv/italk69) Channel\n→ [**Twitter**](https://twitter.com/ThisIsITalk) Account\n→ [**Instagram**](https://www.instagram.com/lookatitalk) Account\n→ [**TikTok**](https://www.tiktok.com/@imitalk) Account\n→ [**Spotify**](https://open.spotify.com/user/govhq) Account`)
            .setColor(interaction.member.displayColor)

        await interaction.reply({ embeds: [socialLinks] });
    },
};