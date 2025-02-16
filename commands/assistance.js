const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assistance')
        .setDescription('Alerts the moderation team for server emergencies'),
    async execute(interaction) {
        const assistanceRow = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('assistance-select')
                    .setPlaceholder('Choose Reason')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions({
                        label: 'Hate Speech',
                        description: 'A user is using hateful speech against a group of people',
                        value: 'hatespeech',
                    }, {
                        label: 'NSFW',
                        description: 'A user is posting NSFW/inappropriate content',
                        value: 'nsfw',
                    }, {
                        label: 'Spam',
                        description: 'A user is flooding chat/committing mass spam',
                        value: 'spam',
                    }, {
                        label: 'Troll',
                        description: 'A user is trolling chat/breaking rules purposefully',
                        value: 'troll',
                    }, {
                        label: 'Other',
                        description: 'None of the options here are what I am calling assistance for',
                        value: 'other',
                    },
                )
            );

        await interaction.reply({ content: 'What are you calling assistance for? Pick an option and the staff team will be notified.', components: [assistanceRow], ephemeral: true });
    },
};