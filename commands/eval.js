const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eval')
        .setDescription('Evaluate a custom code block')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('eval')
                .setDescription('The line of code to evaluate')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (interaction.user.id !== '528759471514845194') return interaction.reply({ content: `You cannot access this command.`, ephemeral: true });

        let eval_code = interaction.options.getString('eval');

        await interaction.deferReply({ ephemeral: true });

        try {
            let evaled = eval(eval_code);

            if (typeof evaled !== "number" && typeof evaled !== "string" && typeof evaled !== "boolean") evaled = `Output could not be converted to text (output was of type: ${typeof evaled}).`;
            if (typeof evaled === "object") evaled = JSON.stringify(evaled);

            let hrDiff = process.hrtime(process.hrtime());

            await interaction.editReply({ content: `Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ""}${hrDiff[1] / 1000000}ms.*\`\`\`yaml\n${evaled}\n\`\`\``, ephemeral: true });
        } catch (e) {
            await interaction.editReply({ content: `An error occurred: \`${e.message}\``, ephemeral: true });

            console.log(e);
        }
    },
};