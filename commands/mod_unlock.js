const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks a channel and announces it in the specified channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('What channel do you want to unlock?')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true),
        ),

    async execute(interaction) {

        const channel = interaction.options.getChannel('channel');

        channel.permissionOverwrites.edit(interaction.guild.id, {

            SendMessages: true,

        }).then(async () => {

            await channel.send(`This channel has been unlocked. Thank you for your patience. <:bITFVictory:1063265610303295619>`);

            await interaction.reply({ content: `Unlocked ${channel}. <:bITFVictory:1063265610303295619>` });

        });

    },

};