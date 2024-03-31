const { Client, SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

const lcArray = ([
    { name: 'Everyone', value: '0' },
    { name: 'Level 5+', value: '5' },
    { name: 'Level 10+', value: '10' },
    { name: 'Level 20+', value: '20' },
    { name: 'Level 30+', value: '30' },
    { name: 'Level 40+', value: '40' },
    { name: 'Level 50+', value: '50' },
    { name: 'Level 60+', value: '60' },
    { name: 'Level 70+', value: '70' },
    { name: 'Level 80+', value: '80' },
    { name: 'Level 90+', value: '90' },
    { name: 'Level 100+', value: '100' }
]);

const pcArray = ([
    { name: 'View Channel', value: 'viewchannel' },
    { name: 'Send Messages', value: 'sendmessages' },
    { name: 'Send Messages in Threads', value: 'sendmessagesinthreads' },
    { name: 'Create Public Threads', value: 'createpublicthreads' },
    { name: 'Create Private Threads', value: 'createprivatethreads' },
    { name: 'Embed Links', value: 'embedlinks' },
    { name: 'Attach Files', value: 'attachfiles' },
    { name: 'Add Reactions', value: 'addreactions' },
    { name: 'Use External Emoji', value: 'useexternalemoji' },
    { name: 'Use External Stickers', value: 'useexternalstickers' },
    { name: 'Use Soundboard', value: 'usesoundboard' },
    { name: 'Use External Soundboard Sounds', value: 'useexternalsounds' }
]);

var lvlArray = ([
    { name: 0, value: '614193406838571085' }, // @everyone
    { name: 5, value: '615583350819913750' },
    { name: 10, value: '615583518793400321' },
    { name: 20, value: '615583720828829706' },
    { name: 30, value: '615583961942327316' },
    { name: 40, value: '615584087054483456' },
    { name: 50, value: '615584329929850900' },
    { name: 60, value: '615584518849429512' },
    { name: 70, value: '615584694683172894' },
    { name: 80, value: '615584884706115586' },
    { name: 90, value: '615585052654436370' },
    { name: 100, value: '615585157595791475' },
]);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-perm-edit')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDescription('Edits channel permissions for a large group of Levels (e.g. Level 10 and above)')
        .setDMPermission(false)
        .addChannelOption((option) =>
            option.setName('channel')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildForum)
                .setDescription('What channel should this permission change affect?')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('access')
                .setDescription('What levels should this permission change affect?')
                .addChoices(...lcArray)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('permission')
                .setDescription('What permission would this change edit?')
                .addChoices(...pcArray)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('value')
                .setDescription('What value should the permission change to?')
                .addChoices({
                    name: '✅ Grant',
                    value: 'permtrue'
                }, {
                    name: '❔ Neutral',
                    value: 'permneutral'
                }, {
                    name: '⛔ Deny',
                    value: 'permfalse'
                })
                .setRequired(true)
        ),
    async execute(interaction) {
        const permChannel = interaction.options.getChannel('channel');
        const permAccess = parseInt(interaction.options.getString('access'));
        const permPerm = interaction.options.getString('permission');
        const permValue = interaction.options.getString('value');

        var pFlagBit;
        var pValue;

        pValue = (permValue == 'permtrue') ? pValue = true : (permValue == 'permfalse') ? pValue = false : pValue = null;

        ///////////////////////////// Set permission flag bit
        switch (permPerm) {
            case "viewchannel":
                pFlagBit = PermissionFlagsBits.ViewChannel;
                break;
            case "sendmessages":
                pFlagBit = PermissionFlagsBits.SendMessages;
                break;
            case "sendmessagesinthreads":
                pFlagBit = PermissionFlagsBits.SendMessagesInThreads;
                break;
            case "createpublicthreads":
                pFlagBit = PermissionFlagsBits.CreatePublicThreads;
                break;
            case "createprivatethreads":
                pFlagBit = PermissionFlagsBits.CreatePrivateThreads;
                break;
            case "embedlinks":
                pFlagBit = PermissionFlagsBits.EmbedLinks;
                break;
            case "attachfiles":
                pFlagBit = PermissionFlagsBits.AttachFiles;
                break;
            case "addreactions":
                pFlagBit = PermissionFlagsBits.AddReactions;
                break;
            case "useexternalemoji":
                pFlagBit = PermissionFlagsBits.UseExternalEmojis;
                break;
            case "useexternalstickers":
                pFlagBit = PermissionFlagsBits.UseExternalStickers;
                break;
            case "usesoundboard":
                pFlagBit = PermissionFlagsBits.UseSoundboard;
                break;
            case "useexternalsounds":
                pFlagBit = PermissionFlagsBits.UseExternalSounds;
                break;
            default:
                break;
        }

        ///////////////////////////////////// Logic
        const permIndex = lvlArray.map((v) => v.name).indexOf(permAccess);

        if (permIndex == -1) return interaction.reply({ content: 'Something went wrong, and I couldn\'t find an index for that value.' });
        if (pFlagBit == null) return interaction.reply({ content: 'Something went wrong, and I couldn\'t the permission flag bit for that value.' });
        if (pValue === undefined) return interaction.reply({ content: 'Something went wrong, and I couldn\'t find a permission value to use.' });

        const newLevelArray = lvlArray.slice(permIndex);

        if (permAccess != 0) {
            let changeCounter = 0;

            interaction.deferReply().then(() => {
                for (const item of newLevelArray) {
                    permChannel.permissionOverwrites.edit(item.value, { [pFlagBit]: pValue }).then(async () => {
                        changeCounter++;

                        if (changeCounter == newLevelArray.length) {
                            interaction.followUp({ content: `${(pValue == true) ? 'Enabled' : (pValue == false) ? 'Disabled' : 'Unset'} **${pcArray[pcArray.map((v) => v.value).indexOf(permPerm)].name}** permission for **${changeCounter} roles** in ${permChannel}. <:bITFGG:1022548636481114172>` });
                        }
                    });
                }
            });
        } else if (permAccess === 0) {
            interaction.deferReply().then(() => {
                permChannel.permissionOverwrites.edit(interaction.guild.id, { [pFlagBit]: pValue }).then(async () => {
                    await interaction.followUp({ content: `${(pValue == true) ? 'Enabled' : (pValue == false) ? 'Disabled' : 'Unset'} **${pcArray[pcArray.map((v) => v.value).indexOf(permPerm)].name}** permission for **everyone** in ${permChannel}. <:bITFGG:1022548636481114172>` });
                });
            });
        }
    }
};