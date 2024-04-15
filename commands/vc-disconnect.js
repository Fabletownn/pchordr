const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-disconnect')
        .setDescription('Disconnects all server members from a specified voice channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('What voice channel would you like to disconnect all users from?')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        ),
    async execute(interaction) {
        const channelDisconnect = interaction.options.getChannel('channel');

        if (channelDisconnect.members.size <= 0) return interaction.reply(`Failed to disconnect members, as there are no occupants in that channel. <:bITFSweat:1022548683176284281>`);

        await channelDisconnect.members.each((member) => {
            if (!member.user.bot) member.voice.disconnect();
        });

        await interaction.reply(`Disconnected all members from ${channelDisconnect}. <:bITFVictory:1063265610303295619>`)
    },
};