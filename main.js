require('dotenv').config();

const crypto = require('crypto');
const fs = require('node:fs');
const path = require('node:path');
const {
    Discord,
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    PartialGroupDMChannel
} = require('discord.js');

const mongoose = require('mongoose');

const client = new Client({

    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks],
    
    partials: [Partials.User, Partials.Channel, Partials.Message, PartialGroupDMChannel],
    
    allowedMentions: {

        parse: ['users', 'everyone', 'roles'],
        repliedUser: false

    }

});

mongoose.connect(process.env.MONGOPASS, {

    useNewUrlParser: true,
    useUnifiedTopology: true,

});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);

}

client.events = new Collection();

['command_handler', 'event_handler', 'error_handler'].forEach((handler) => {

    require(`./handlers/${handler}`)(client, Discord);

});

client.on('interactionCreate', async (interaction) => {

    const command = client.commands.get(interaction.commandName);

    if ((interaction.isChatInputCommand()) && (command)) {

        try {

            await command.execute(interaction);
    
        } catch (error) {

            const errorCode = crypto.randomBytes(15).toString('hex');
    
            console.error(error);

            await client.channels.cache.get('890718960016838686').send(`## ${errorCode}\n\n**User**: ${interaction.user.username} (${interaction.user.id})\n**Command**: /${interaction.commandName}\n**Error**: ${error}`);
    
            return interaction.reply({ content: 'An issue occurred trying to execute that command. Contact <@528759471514845194> with the following code if this continues happening. <:bITFSweat:1022548683176284281>\n\nError Code: **`' + errorCode + '`**', ephemeral: true });
            
        }

    }

});

client.login(process.env.TOKEN);