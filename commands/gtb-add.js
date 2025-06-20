const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GTB = require('../models/gtb.js');
const { Dropbox } = require('dropbox');
const superagent = require('superagent');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gtb-add')
        .setDescription('Guess The Blank: Add a new round with new round information')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addStringOption((option) =>
            option.setName('answer')
                .setDescription('The answer for this Guess The Blank image')
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(100)
        )
        .addAttachmentOption((option) =>
            option.setName('image')
                .setDescription('The image for this Guess The Blank round')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('prompt')
                .setDescription('The prompt for this Guess The Blank round (default: "What do you see?")')
                .setRequired(false)
                .setMinLength(10)
                .setMaxLength(100)
        )
        .addIntegerOption((option) =>
            option.setName('round-override')
                .setDescription('If you need to override details for a specific round, the round number')
                .setRequired(false)
                .setMinValue(1)
        ),
    async execute(interaction) {
        const gtbData = await GTB.findOne({ guildID: interaction.guild.id });
        if (!gtbData) return interaction.reply({ content: 'There is no Guess The Blank data set up yet. Run the `/gtb-setup` command to get started.' });

        const gtbAnswer = interaction.options.getString('answer');
        const gtbImage = interaction.options.getAttachment('image');
        const gtbPrompt = interaction.options.getString('prompt') || 'What do you see?';
        const gtbOverride = interaction.options.getInteger('round-override')?.toString() || null;
        const gtbImageURL = gtbImage.url.toLowerCase().split('?ex=')[0];

        if (!gtbImageURL.endsWith('png') && !gtbImageURL.endsWith('jpg') && !gtbImageURL.endsWith('jpeg')) return interaction.reply({ content: 'You need to upload a `png`, `jpg`, or `jpeg` image. Otherwise file extensions are not allowed.' });

        const gtbMap = gtbData.rounds;
        const gtbCurrRounds = gtbMap.size;
        const gtbNewRound = (gtbCurrRounds + 1).toString();
        const gtbRound = (gtbOverride ? gtbOverride : gtbNewRound);

        let uploadLink;
        let uploadMessage = '';

        await interaction.deferReply();

        // Try and upload the image to Dropbox first, otherwise use the CDN link which will expire
        try {
            const dbx = await createDBXClient(); // Create Dropbox client
            
            const response = await superagent.get(gtbImage.url).buffer(true);
            const fileExtension = gtbImage.name.split('.')[1];
            const fileName = `/PChord/Round${gtbRound}.${fileExtension}`;

            // To prevent a duplicate sharing link error, delete a file existing in the same path if any
            try {
                const fileMetadata = await dbx.filesGetMetadata({ path: fileName });
                if (fileMetadata) await dbx.filesDeleteV2({ path: fileName });
            } catch (error) {
                // There is no need for an error to be logged here since this is only for checking
            }

            // Request a file upload to Dropbox
            await dbx.filesUpload({
                path: fileName,
                contents: response.body,
                mode: { '.tag': 'overwrite' },
            });

            // Create the shared link, edit it to make it a raw file, and set it as the upload link
            const sharedLink = await dbx.sharingCreateSharedLinkWithSettings({ path: fileName });
            const createdLink = sharedLink.result.url;
            const editedLink = createdLink.replace(/(&dl=0)/g, '&raw=1');

            uploadLink = editedLink;

            // Otherwise, if there was an error, just use the CDN link
        } catch (err) {
            console.log(err);

            uploadLink = gtbImage.url;
            uploadMessage = '-# **⚠️ Image has not been uploaded and will soon expire!**';
        }

        const addArray = [gtbAnswer, uploadLink, gtbPrompt];
        await gtbMap.set(gtbRound, addArray);

        gtbData.rounds = gtbMap;
        gtbData.save().catch((err) => console.log(err));

        await interaction.followUp({ content: `## <:bITFGG:1022548636481114172> Round #${gtbOverride ? gtbOverride : gtbNewRound} has been ${(gtbOverride !== null) ? 'modified' : 'set up'}\n\n- **Prompt**: ${gtbPrompt}\n- **Answer**: ${gtbAnswer}\n\n${uploadMessage}`, files: [uploadLink] });
    },
};

async function getAccessToken() {
    try {
        const response = await superagent
            .post('https://api.dropbox.com/oauth2/token')
            .type('form')
            .send({
                grant_type: 'refresh_token',
                refresh_token: process.env.DBX_REFRESH_TOKEN,
                client_id: process.env.DBX_APP_KEY,
                client_secret: process.env.DBX_APP_SECRET
            });

        return response.body.access_token;
    } catch (err) {
        console.log('Error trying to get Dropbox access token:', err.response?.body || err.message);
        return null;
    }
}

async function createDBXClient() {
    const accessToken = await getAccessToken();
    if (!accessToken) return console.log('Failed to get access token');

    return new Dropbox({ accessToken });
}