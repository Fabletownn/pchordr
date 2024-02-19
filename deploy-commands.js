require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    commands.push(command.data.toJSON());
}

const rest = new REST({
    version: '10'
}).setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENTID), {
    body: []
}).then(() => console.log('Successfully unregistered global application commands.')).catch(console.error);

rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), {
    body: []
}).then(() => console.log('Successfully unregistered application commands to the main server.')).catch(console.error); // TEMP

rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, '685876599199236173'), {
    body: []
}).then(() => console.log('Successfully unregistered application commands to the appeals server.')).catch(console.error); // TEMP