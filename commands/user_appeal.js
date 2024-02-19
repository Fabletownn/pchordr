const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('appeal')
        .setDescription('Begin the ban appeal process and modal')
        .setDMPermission(false),

    async execute(interaction) {
        if (interaction.guild.id !== '685876599199236173') return;

        const appealModal = new ModalBuilder()
            .setCustomId('appeal-modal')
            .setTitle('File Ban Appeal')
            .addComponents([
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('appeal-msg')
                        .setLabel('Appeal Message')
                        .setPlaceholder('Why were you banned? Why should you be unbanned? etc.')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(2000)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('appeal-notes')
                        .setLabel('Additional Notes')
                        .setPlaceholder('Note...')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                        .setMaxLength(500)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('appeal-attachments')
                        .setLabel('Additional Files')
                        .setPlaceholder('https://cdn.discordapp.com/image-or-file-url-here/')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                        .setMaxLength(500)
                ),
            ]);
        
        const fileEmbed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.displayName})`, iconURL: interaction.user.displayAvatarURL({ size: 512, dynamic: true}) })
            .setDescription(`<@${interaction.user.id}> has filed an appeal and obtained the <@&1208961459283959848> role.`)
            .setFooter({ text: `User ID: ${interaction.user.id}` })
            .setTimestamp()
            .setColor('#EDC351')

        await interaction.showModal(appealModal);
        await interaction.member.roles.add('1208961459283959848');
        await interaction.client.channels.cache.get('803199322379780117').send({ embeds: [fileEmbed] });
    }
}