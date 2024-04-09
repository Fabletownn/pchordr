const CONFIG = require('../models/config.js');
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

const configOptions = ([
    { name: 'Set General Channel ID (Channel)', value: 'generalchat' },
    { name: 'Set Giveaway Channel ID (Channel)', value: 'giveawaychannel' },
    { name: 'Set Giveaway Winner Channel ID (Channel)', value: 'giveawaywinnerchannel' },
    { name: 'Set Mod Chat Channel ID (Channel)', value: 'modchat' },
    { name: 'Set Server Updates Channel ID (Channel)', value: 'serverupdateschannel' },
    { name: 'Set Polls Channel ID (Channel)', value: 'pollschannel' },
    { name: 'Set Art Channel ID (Channel)', value: 'artchannel' },
    { name: 'Set Game Photography Channel ID (Channel)', value: 'gpchannel' },
    { name: 'Set Server Updates Channel ID (Channel)', value: 'serverupdateschannel' },
    { name: 'Set Supporters Channel ID (Channel)', value: 'supporterschannel' },
    { name: 'Set Guess The Blank Channel ID (Channel)', value: 'gtbchannel' },
    { name: 'Set Administrator Role ID (Role)', value: 'adminrole' },
    { name: 'Set Moderator Role ID (Role)', value: 'modrole' },
    { name: 'Set Supporters Role ID (Role)', value: 'supportersrole' },
    { name: 'Set Server Boosters Role ID (Role)', value: 'boosterrole' },
    { name: 'Set YouTube Members Role ID (Role)', value: 'ytmemberrole' },
    { name: 'Set Twitch Subscribers Role ID (Role)', value: 'twitchsubrole' },
    { name: 'Set Giveaway Winner Role ID (Role)', value: 'giveawaywinnerrole' },
    { name: 'Set Guess The Blank Winner Role ID (Role)', value: 'gtbwinnerrole' },
    { name: 'Set Autopublishing Feature (Boolean)', value: 'autopublish' },
    { name: 'Set VXTwitter Feature (Boolean)', value: 'vxtwitter' },
    { name: 'Set Non-Art Delete Feature (Boolean)', value: 'artdelete' },
    { name: 'Set General Greeting Feature (Boolean)', value: 'generalgreeting' },
    { name: 'Set Giveaway Winner Feature (Boolean)', value: 'autogiveaway' },
    { name: 'Set Poll Deletion Feature (Boolean)', value: 'deletepoll' }
]);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config-edit')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Edits configuration values of specific bot features')
        .setDMPermission(false)
        .addStringOption((option) =>
            option.setName('config')
                .setDescription('What are you looking to change?')
                .addChoices(...configOptions)
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option.setName('channel')
                .addChannelTypes(ChannelType.AnnouncementThread, ChannelType.GuildForum, ChannelType.GuildVoice, ChannelType.GuildText)
                .setDescription('(If the configuration requires channel) The channel it will be set to')
                .setRequired(false)
        )
        .addRoleOption((option) =>
            option.setName('role')
                .setDescription('(If the configuration requires role) The role it will be set to')
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option.setName('boolean')
                .setDescription('(If the configuration requires boolean) The boolean it will be set to')
                .setRequired(false)
        ),
    async execute(interaction) {
        CONFIG.findOne({
            guildID: interaction.guild.id,
        }, async (err, data) => {
            const configChoice = interaction.options.get('config').value;
            const channelOption = interaction.options.getChannel('channel');
            const roleOption = interaction.options.getRole('role');
            const boolOption = interaction.options.getBoolean('boolean');
            
            if (!channelOption && !roleOption && !boolOption) return interaction.reply({ content: 'This command requires a configuration option to be chosen from (e.g. "Change General ID (Channel)" requires "channel" option).' });

            if (err) return interaction.reply({ content: 'An unknown issue came up and I could not handle configurations. <:bITFSweat:1022548683176284281>', ephemeral: true });
            if (!data) return interaction.reply({ content: 'Could not configurate values since data hasn\'t been set up yet. Use the `/config-setup` command to get started. <:bITFSweat:1022548683176284281>' });

            switch (configChoice) {
                case "generalchat":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.generalChat = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the general channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "giveawaychannel":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.giveawayChannel = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the giveaway channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "giveawaywinnerchannel":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.giveawayWinnerChannel = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the giveaway winner channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "modchat":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.modChat = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the mod chat channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "serverupdateschannel":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.serverUpdatesChat = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the server updates channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "pollschannel":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.pollsChat = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the polls channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "artchannel":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.artChat = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the art channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "gpchannel":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.gpChat = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the game photography channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "supporterschannel":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.supportersChat = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the supporters channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "gtbchannel":
                    if (!channelOption) return interaction.reply({ content: 'This configuration requires a `channel` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.gtbChat = channelOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Configuration requiring the Guess The Blank channel will now function in <#${channelOption.id}> successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "adminrole":
                    if (!roleOption) return interaction.reply({ content: 'This configuration requires a `role` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.adminRole = roleOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Features requiring the Administrator role will now function using the <@&${roleOption.id}> role successfully. <:bITFGG:1022548636481114172>`, allowedMentions: { parse: [] } }));
                    break;
                case "modrole":
                    if (!roleOption) return interaction.reply({ content: 'This configuration requires a `role` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.modRole = roleOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Features requiring the Moderator role will now function using the <@&${roleOption.id}> role successfully. <:bITFGG:1022548636481114172>`, allowedMentions: { parse: [] } }));
                    break;
                case "supportersrole":
                    if (!roleOption) return interaction.reply({ content: 'This configuration requires a `role` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.supportersRole = roleOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Features requiring the Supporters role will now function using the <@&${roleOption.id}> role successfully. <:bITFGG:1022548636481114172>`, allowedMentions: { parse: [] } }));
                    break;
                case "boosterrole":
                    if (!roleOption) return interaction.reply({ content: 'This configuration requires a `role` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.boosterRole = roleOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Features requiring the Server Booster role will now function using the <@&${roleOption.id}> role successfully. <:bITFGG:1022548636481114172>`, allowedMentions: { parse: [] } }));
                    break;
                case "ytmemberrole":
                    if (!roleOption) return interaction.reply({ content: 'This configuration requires a `role` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.ytRole = roleOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Features requiring the YouTube Members role will now function using the <@&${roleOption.id}> role successfully. <:bITFGG:1022548636481114172>`, allowedMentions: { parse: [] } }));
                    break;
                case "twitchsubrole":
                    if (!roleOption) return interaction.reply({ content: 'This configuration requires a `role` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.twitchRole = roleOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Features requiring the Twitch Subscribers role will now function using the <@&${roleOption.id}> role successfully. <:bITFGG:1022548636481114172>`, allowedMentions: { parse: [] } }));
                    break;
                case "giveawaywinnerrole":
                    if (!roleOption) return interaction.reply({ content: 'This configuration requires a `role` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.giveawayWinnerRole = roleOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Features requiring the Giveaway Winner role will now function using the <@&${roleOption.id}> role successfully. <:bITFGG:1022548636481114172>`, allowedMentions: { parse: [] } }));
                    break;
                case "gtbwinnerrole":
                    if (!roleOption) return interaction.reply({ content: 'This configuration requires a `role` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.gtbRole = roleOption.id;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Features requiring the Guess The Blank Champion role will now function using the <@&${roleOption.id}> role successfully. <:bITFGG:1022548636481114172>`, allowedMentions: { parse: [] } }));
                    break;
                case "autopublish":
                    if (!boolOption) return interaction.reply({ content: 'This configuration requires a `boolean` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.autopublish = boolOption;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Autopublishing in announcement channels has been ${(boolOption === true) ? 'enabled' : 'disabled'} successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "vxtwitter":
                    if (!boolOption) return interaction.reply({ content: 'This configuration requires a `boolean` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.vxtwitter = boolOption;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Better Twitter embedding in the mod chat channel has been ${(boolOption === true) ? 'enabled' : 'disabled'} successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "artdelete":
                    if (!boolOption) return interaction.reply({ content: 'This configuration requires a `boolean` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.artdelete = boolOption;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Deleting non-art or linked posts in the art channel has been ${(boolOption === true) ? 'enabled' : 'disabled'} successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "generalgreeting":
                    if (!boolOption) return interaction.reply({ content: 'This configuration requires a `boolean` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.greeting = boolOption;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Reaction greetings in the general channel has been ${(boolOption === true) ? 'enabled' : 'disabled'} successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "autogiveaway":
                    if (!boolOption) return interaction.reply({ content: 'This configuration requires a `boolean` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.autogiveaway = boolOption;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Setting up channels for new giveaway winners in the giveaway channel has been ${(boolOption === true) ? 'enabled' : 'disabled'} successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                case "deletepoll":
                    if (!boolOption) return interaction.reply({ content: 'This configuration requires a `boolean` option to be filled out. <:bITFFacepalm:1063265618155020358>' });

                    data.deletepoll = boolOption;
                    data.save().catch((err) => console.log(err)).then(() => interaction.reply({ content: `Poll deletions by non-Moderators has been ${(boolOption === true) ? 'enabled' : 'disabled'} successfully. <:bITFGG:1022548636481114172>` }));
                    break;
                default:
                    break;
            }

        });

    },

};