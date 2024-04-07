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
        let memberCounter = 0;

        if (fromSize <= 0) return interaction.reply({ content: `Failed to move members, as there are no occupants in the original channel. <:bITFSweat:1022548683176284281>` });
        if (channelFrom === channelTo) return interaction.reply({ content: `Failed to move members, as you provided the same channel twice. <:bITFSweat:1022548683176284281>` });

        await channelFrom.members.each((member) => {
            if (!member.user.bot) {
                member.voice.setChannel(channelTo);
                memberCounter++;
            }
        });

        await interaction.reply({ content: `Merged ${memberCounter} member(s) from <#${channelFrom.id}> to <#${channelTo.id}> successfully. <:bITFGG:1022548636481114172>` });
    },
};