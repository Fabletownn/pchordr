const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks a channel and announces it in the specified channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('What channel do you want to unlock?')
                .addChannelTypes(ChannelType.GuildForum, ChannelType.GuildText)
                .setRequired(true),
        ),
    async execute(interaction) {
        const channelOption = interaction.options.getChannel('channel');

        await channelOption.permissionOverwrites.edit(interaction.guild.id, {
            SendMessages: true,
        });

        await channelOption.send(`This channel has been unlocked. Thank you for your patience. <:bITFVictory:1063265610303295619>`);

        await interaction.reply({ content: `The <#${channelOption.id}> channel has been unlocked. <:bITFVictory:1063265610303295619>` });
    },
};