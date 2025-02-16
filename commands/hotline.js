const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hotline')
        .setDescription('Provides suicide hotline information for those in need')
        .addBooleanOption((option) =>
            option.setName('hidden')
                .setDescription('Whether the message is put in chat or sent privately to you')
                .setRequired(true)
        ),
    async execute(interaction) {
        const isHidden = interaction.options.getBoolean('hidden');
        const hotlineInformation = "Suicide Hotlines provide help to those in need. Please contact a hotline if you need support yourself or need help supporting somebody in need. If you're concerned about somebody, please encourage them to contact a hotline.\n**National Suicide Prevention Lifeline**: http://www.suicidepreventionlifeline.org/\n**Phone Number**: 1-800-273-TALK (8225) __OR__ 988\n**Lifeline Crisis Chat**: http://www.suicidepreventionlifeline.org/gethelp/lifelinechat.aspx";

        await interaction.reply({ content: hotlineInformation, ephemeral: isHidden });
    },
};