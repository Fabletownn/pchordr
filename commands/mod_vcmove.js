const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-move')
        .setDescription('Moves all server members from a voice channel to another')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addChannelOption((option) =>
            option.setName('from')
                .setDescription('What voice channel would you like to move all users FROM?')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        )
        .addChannelOption((option) =>
            option.setName('to')
                .setDescription('What voice channel would you like to move all users TO?')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        ),

    async execute(interaction) {

        const channelFrom = interaction.options.getChannel('from');
        const channelTo = interaction.options.getChannel('to');

        const fromSize = channelFrom.members.size;

        if (fromSize <= 0) return interaction.reply({ content: `Failed to move members, as there are no occupants in the original channel. <:bITFSweat:1022548683176284281>` });
        if (channelFrom === channelTo) return interaction.reply({ content: `Failed to move members, as you provided the same channel twice. <:bITFSweat:1022548683176284281>` });

        channelFrom.members.each(async (member) => {

            await member.voice.setChannel(channelTo).then(async() => await interaction.reply({ content: `Merged **${fromSize} member(s)** from ${channelFrom} → ${channelTo}. <:bITFVictory:1063265610303295619>` }));

        });

    },

};