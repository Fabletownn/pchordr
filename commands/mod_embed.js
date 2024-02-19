const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Creates a custom embed and sends to the specified channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('Specified channel to send the embed in?')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        )
        .addStringOption((option) =>
            option.setName('title')
                .setDescription('What would you like the title to be?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('description')
                .setDescription('What would you like the description to be? (use \\n for a new line)')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('footer')
                .setDescription('What would you like the footer to be?')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('color')
                .setDescription('What would you like the color to be?')
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('message')
                .setDescription('What would you like the message outside of the embed to be?')
                .setRequired(false)
        )
        .addAttachmentOption((option) =>
            option.setName('attachment')
                .setDescription('What attachments would you like to add?')
                .setRequired(false)
        ),

    async execute(interaction) {

        let messageContents = null;

        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description').replace(/\\n/g, '\n');
        const footer = interaction.options.getString('footer');
        const color = interaction.options.getString('color');
        const attachment = interaction.options.getAttachment('attachment');

        if (interaction.options.getString('message') !== null) messageContents = interaction.options.getString('message');

        if (attachment) {

            if (footer) {

                const custom_embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setFooter({ text: footer })
                    .setColor(color)
                    .setImage(attachment.url)

                const test = channel.send({ content: messageContents, embeds: [custom_embed] });

                await interaction.reply({ content: `Sent embed to ${channel} with the assets **title**, **description**, **footer**, **color**, **attachment**. <:bITFVictory:1063265610303295619>` });

            } else if (!footer) {

                const custom_embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color || '23ff09')
                    .setImage(attachment.url)

                channel.send({

                    content: messageContents,
                    embeds: [custom_embed]

                });

                await interaction.reply({ content: `Sent embed to ${channel} with the assets **title**, **description**, **color**, **attachment**. <:bITFVictory:1063265610303295619>` });
            }

        } else {

            if (footer) {

                const custom_embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setFooter({ text: footer })
                    .setColor(color || '23ff09')

                channel.send({

                    content: messageContents,
                    embeds: [custom_embed]

                });

                await interaction.reply({ content: `Sent embed to ${channel} with the assets **title**, **description**, **footer**, **color**. <:bITFVictory:1063265610303295619>` });

            } else if (!footer) {

                const custom_embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color || '23ff09')

                channel.send({

                    content: messageContents,
                    embeds: [custom_embed]

                });

                await interaction.reply({ content: `Sent embed to ${channel} with the assets **title**, **description**, **color**. <:bITFVictory:1063265610303295619>` });

            }

        }

    },

};