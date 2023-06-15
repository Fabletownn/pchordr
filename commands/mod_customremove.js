const CUSTOM = require('../models/customs.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-role-remove')
        .setDescription('Deletes and removes an owner from a custom role')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addRoleOption((option) =>
            option.setName('role')
                .setDescription('What custom role would you like to rid an owner of?')
                .setRequired(true)
        )
        .setDMPermission(false),

    async execute(interaction) {

        const role = interaction.options.getRole('role');

        CUSTOM.findOne({

            guildID: interaction.guild.id,
            roleID: role.id

        }, async (err, data) => {

            if (err) return console.log(err);

            if (!data) return interaction.reply({ content: `Failed to remove that owner, as there is no data for that role. Add an owner using the \`/custom-role-set-owner\` or \`/custom-role-add\` commands.` });

            const confMessage = `Member owning the role <@&${data.roleID}> will no longer have ownership and be able to edit the role.\n\nIt is now safe to remove the role from the user and/or delete the custom role if necessary.`;

            await data.delete();
            
            await interaction.reply({ content: confMessage, allowedMentions: { parse: [] } });

        });

    },

};