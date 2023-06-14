const CUSTOM = require('../models/customs.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-role-set-owner')
        .setDescription('Sets the owner of an already existing custom role')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addRoleOption((option) =>
            option.setName('role')
                .setDescription('What custom role would you like to set an owner of?')
                .setRequired(true)
        )
        .addUserOption((option) =>
            option.setName('owner')
                .setDescription('Who is the owner of this role?')
                .setRequired(true)
        ),

    async execute(interaction) {

        const role = interaction.options.getRole('role');
        const roleOwner = interaction.options.getMember('owner');

        CUSTOM.findOne({

            guildID: interaction.guild.id,
            userID: roleOwner.user.id

        }, async (err, data) => {

            if (err) return console.log(err);
            //if (data) return interaction.reply({ content: `Couldn't set the owner of that role, as they already own one! (already owned role ID: ${data.roleID})` });

            const newRoleData = new CUSTOM({
                guildID: interaction.guild.id,
                roleID: role.id,
                roleColor: '000000',
                roleOwner: roleOwner.user.id
            });

            await newRoleData.save().catch((err) => console.log(err));

            await interaction.reply({ content: `Set custom role <@&${role.id}> owner to <@${roleOwner.user.id}>.\n\n${roleOwner.displayName || roleOwner.user.username} can edit the role using the \`/custom-role-edit\` command, or you can remove it via the \`/custom-role-remove\` command.`, allowedMentions: { parse: [] } });

        });

    },

};