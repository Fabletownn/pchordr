const CUSTOM = require('../models/customs.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-role-edit')
        .setDescription('Allows members to edit their own custom roles')
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('role')
                .setDescription('What is the name of your custom role?')
                .setMaxLength(100)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('name')
                .setDescription('What name do you want the custom role to have?')
                .setMaxLength(100)
                .setRequired(false)
        )
        .addStringOption((option) =>
            option.setName('hex-color')
                .setDescription('What color do you want the custom role to have? (hex code)')
                .setMinLength(6)
                .setMaxLength(6)
                .setRequired(false)
        ),

    async execute(interaction) {

        const roleName = interaction.options.getString('role').toLowerCase();
        const customRole = interaction.guild.roles.cache.find((role) => role.name.toLowerCase() === roleName);
        const newRoleName = interaction.options.getString('name');
        const newRoleHex = interaction.options.getString('hex-color');

        var propertiesEdited = [];

        if (!customRole) return interaction.reply({ content: `Could not find a role in the server with the name of **${roleName}**.`, allowedMentions: { parse: [] } });
        if (newRoleHex && !newRoleHex.match(/(^[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i)) return interaction.reply({ content: `The hex code given of **${newRoleHex}** is improper or cannot be used.`, allowedMentions: { parse: [] } });

        CUSTOM.findOne({

            guildID: interaction.guild.id,
            roleID: customRole.id

        }, async (err, data) => {

            if (err) return interaction.reply({ content: `Could not find owner data for that role (**${roleName}**). If this is your custom role, ask a Moderator to set you as the owner.` });

            if (!data) return interaction.reply({ content: `Could not find owner data for that role (**${roleName}**). If this is your custom role, ask a Moderator to set you as the owner.` });

            if (data.roleOwner !== interaction.user.id) return interaction.reply({ content: `Could not change data for that role (**${roleName}**). You are not the owner of that custom role!` });

            await interaction.deferReply();

            if (newRoleName) {

                try {

                    customRole.edit({ name: newRoleName });

                    propertiesEdited.push(`role name (**${newRoleName}**)`);

                } catch (err) {

                    propertiesEdited.push(`role name (**invalid**)`);

                    return;

                }

            }

            if (newRoleHex) {

                try {

                    customRole.edit({ color: newRoleHex });

                    propertiesEdited.push(`role color (**${newRoleHex}**)`);

                } catch (err) {

                    propertiesEdited.push(`role name (**invalid**)`);

                    return;

                }

            }

            if ((propertiesEdited.length <= 0) || (propertiesEdited.length === undefined)) return interaction.editReply({ content: `Nothing has been edited for that role (**${roleName}**). Use the optional values to change your custom role.` });

            await interaction.editReply({ content: `Edited the following assets of your custom role: ${propertiesEdited.join(', ')}.` });

            propertiesEdited = [];

        });

    },

};