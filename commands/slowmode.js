const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const sf = require('seconds-formater');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Edits the slowmode on a channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('What channel do you want to edit slowmode in?')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true),
        )
        .addIntegerOption((option) =>
            option.setName('seconds')
                .setDescription('How many seconds per message do you want the channel to have?')
                .setRequired(true)
        ),
    async execute(interaction) {
        const slowmodeChannel = interaction.options.getChannel('channel');
        const limitSeconds = interaction.options.getInteger('seconds');

        const oldSlowmode = slowmodeChannel.rateLimitPerUser || '0';

        if (limitSeconds > 21600) return interaction.reply({ content: `Failed to set slowmode to **${limitSeconds.toLocaleString()} seconds**. Invalid integer was provided (not through 1 to 21,600).` });

        slowmodeChannel.setRateLimitPerUser(limitSeconds).then(async () => {
            if (limitSeconds === '0') return interaction.reply({ content: `Disabled slowmode in ${slowmodeChannel} (previously **${sf.convert(oldSlowmode).format('MM:SS')}**). <:bITFVictory:1063265610303295619>` });

            await interaction.reply({ content: `Edited slowmode in ${slowmodeChannel} (previously **${sf.convert(oldSlowmode).format('MM:SS')}**; now set to **${sf.convert(slowmodeChannel.rateLimitPerUser || 0).format('MM:SS')}**). <:bITFVictory:1063265610303295619>` });
        });
    },
};