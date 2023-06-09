const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks a channel and announces it with the specified reason if given')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('What channel do you want to lock?')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('reason')
                .setDescription('Would you like to add a reason for the lock?')
                .setRequired(true)
        ),

    async execute(interaction) {

        const channel = interaction.options.getChannel('channel');
        const reason = interaction.options.getString('reason') || `none`;

        channel.permissionOverwrites.edit(interaction.guild.id, {

            SendMessages: false,

        }).then(async() => {

            await channel.send(`This channel has been locked by a moderator. Expect further explanation from a staff member soon. <:bITFHuh:1022548647948333117>\n\nReason: **${reason}**`);

            await interaction.reply({ content: `Locked ${channel} channel with the reason "**${reason}**". <:bITFVictory:1063265610303295619>` });

        });

    },

};