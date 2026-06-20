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
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks],
    partials: [Partials.User, Partials.Channel, Partials.Message, Partials.GuildMember, PartialGroupDMChannel],
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

client.login(process.env.TOKEN);