const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Will message a member with specified content if DMs are turned on')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((option) =>
            option.setName('member')
                .setDescription('Who are you looking to message? (ID or mention)')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option.setName('content')
                .setDescription('What message would you like to send them?')
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option.setName('anonymous')
                .setDescription('What anonymity mode would you like to use for this message?')
                .setRequired(true)
        )
        .addAttachmentOption((option) =>
            option.setName('attachment')
                .setDescription('Would you like to add an attachment with the message?')
                .setRequired(false)
        ),
    async execute(interaction) {
        const userMessage = interaction.options.getMember('member');
        const messageContents = interaction.options.getString('content');
        const anonymityMode = interaction.options.getBoolean('anonymous');
        const attachmentContents = interaction.options.getAttachment('attachment');

        let userAuthor;
        let anonState;

        if (anonymityMode == true) userAuthor = 'a staff member';
        if (anonymityMode == true) anonState = 'Anonymously';

        if (anonymityMode == false) userAuthor = interaction.user.username;
        if (anonymityMode == false) anonState = 'Non-anonymously';

        if (attachmentContents) {
            await userMessage.send({ content: `<:bITFThink:1022548686158442537> You have received a message from **${userAuthor}** via I Talk Server:\n\n${messageContents}`, files: [attachmentContents.url] }).then(async () => {
                await interaction.reply(`${anonState} messaged **${userMessage.displayName}** with attachment(s). <:bITFVictory:1063265610303295619>`).catch((err) => interaction.editReply(`Failed to message that user (${err}). Tell them to enable their messages. <:bITFSweat:1022548683176284281>`));
            });
        } else if (!attachmentContents) {
            await userMessage.send({ content: `<:bITFThink:1022548686158442537> You have received a message from **${userAuthor}** via I Talk Server:\n\n${messageContents}` }).then(async () => {
                await interaction.reply(`${anonState} messaged **${userMessage.displayName}** with no attachments. <:bITFVictory:1063265610303295619>`).catch((err) => interaction.editReply(`Failed to message that user (${err}). Tell them to enable their messages. <:bITFSweat:1022548683176284281>`));
            });
        }
    },
};