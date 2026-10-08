require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const {
    Discord,
    Client,
    Collection,
    GatewayIntentBits,
    Partials
} = require('discord.js');
const mongoose = require('mongoose');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // needed for slash commands and server information
        GatewayIntentBits.MessageContent,   // needed for reporting, logging deletes/edits,
        GatewayIntentBits.GuildMessages,    // needed for reporting, logging deletes/edits, etc.
        GatewayIntentBits.GuildMembers,     // needed for giving Supporter role
        GatewayIntentBits.GuildVoiceStates  // needed for custom voice channels
    ],
    partials: [
        Partials.User,      // useful for member search
        Partials.Channel,   // useful for message caching
        Partials.Message    // useful for logging
    ],
    allowedMentions: {
        parse: ['users', 'everyone', 'roles'],
        repliedUser: false
    }
});

mongoose.set('strictQuery', false);
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