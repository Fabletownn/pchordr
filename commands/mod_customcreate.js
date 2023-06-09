const CUSTOM = require('../models/customs.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-role-create')
        .setDescription('Creates and adds an owner to a custom role')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('name')
                .setDescription('What name do they want the role to have?')
                .setMaxLength(100)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('hex-color')
                .setDescription('What color do they want the role to have? (hex code)')
                .setMinLength(6)
                .setMaxLength(6)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option.setName('owner')
                .setDescription('Who is the owner of this role?')
                .setRequired(true)
        ),

    async execute(interaction) {

        const roleName = interaction.options.getString('name');
        const roleColor = interaction.options.getString('hex-color').toLowerCase();
        const roleOwner = interaction.options.getMember('owner');

        CUSTOM.findOne({

            guildID: interaction.guild.id,
            userID: roleOwner.user.id

        }, async (err, data) => {

            if (err) return console.log(err);
            if (data) return interaction.reply({ content: `Couldn't set the owner of that role, as they already own one! (already owned role ID: ${data.roleID})` });
            
            await interaction.guild.roles.create({
                name: roleName,
                color: roleColor,
                permissions: []
            }).then(async (cRole) => {

                const newRoleData = new CUSTOM({
                    guildID: interaction.guild.id,
                    roleID: cRole.id,
                    roleColor: roleColor,
                    roleOwner: roleOwner.user.id
                });
    
                await newRoleData.save().catch((err) => console.log(err));

                await interaction.guild.members.cache.get(roleOwner.user.id).roles.add(cRole.id);

                await interaction.reply({ content: `Created custom role <@&${cRole.id}> with the color **#${roleColor.toUpperCase()}**, and set the owner to <@${roleOwner.user.id}>.\n\n${roleOwner.displayName || roleOwner.user.username} can edit the role using the \`/custom-role-edit\` command, or you can remove it via the \`/custom-role-remove\` command.`, allowedMentions: { parse: [] } });

            });

        });

    },

};