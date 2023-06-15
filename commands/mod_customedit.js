const CUSTOM = require('../models/customs.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-role-edit')
        .setDescription('Allows members to edit their own custom roles (interactive)')
        .setDMPermission(false),

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId('custom-role-editor')
            .setTitle('Edit Your Custom Role')
            .addComponents([
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('custom-role-name')
                        .setLabel('Custom Role Name')
                        .setPlaceholder('The name of your custom role..')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('custom-wanted-name')
                        .setLabel('Your New Name')
                        .setPlaceholder('Your new role name..')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('custom-wanted-color')
                        .setLabel('Your New Color')
                        .setPlaceholder('Your new role color (hex code)..')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                ),
            ]);

        await interaction.showModal(modal);

        await client.channels.cache.get('890718960016838686').send(`<@${interaction.user.id}> (@${interaction.user.username}) prompted a custom role edit with the command`);

    },

};