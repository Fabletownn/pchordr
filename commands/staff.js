const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staff')
        .setDescription('Showcases the I Talk Server staff team'),
    async execute(interaction) {
        let serverAdmins = interaction.guild.roles.cache.find(n => n.id === '614195872347062273').members.map((m) => `${m}\n`);
        let serverModerators = interaction.guild.members.cache.filter((member) => { 
            return member.roles.cache.get('614196214078111745');
        }).map((member) => {
            if ((member.roles.cache.get('614196214078111745')) && !member.roles.cache.get('614195872347062273') && !member.roles.cache.get('614195877627822090')) return member.user;
        }).join(`\n`);

        const staffTeamEmbed = new EmbedBuilder()
            .setAuthor({ name: `I Talk Server's Staff Team!`, iconURL: interaction.guild.iconURL() || '' })
            .addFields([
                { name: `Owner`, value: `<@152597531824619521>`, inline: true },
                { name: `Administrators`, value: serverAdmins.toString().replace(/,/g, ``), inline: true },
                { name: `Moderators`, value: serverModerators.toString().replace(/,/g, ``).replace(/\n\n/g, ``).replace(/\n\n\n/g, `\n`).replace(/></g, `>\n<`), inline: true }
            ])
            .setImage(interaction.guild.bannerURL({
                size: 1024
            }))
            .setColor(interaction.guild.members.cache.get(interaction.client.user.id).displayColor)

        await interaction.reply({ embeds: [staffTeamEmbed] });
    },
};