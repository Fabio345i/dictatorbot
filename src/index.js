"use strict";

require("dotenv").config();
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
for (const folder of fs.readdirSync(commandsPath)) {
  const folderPath = path.join(commandsPath, folder);
  for (const file of fs.readdirSync(folderPath)) {
    const command = require(path.join(folderPath, file));
    client.commands.set(command.data.name, command);
  }
}

const eventsPath = path.join(__dirname, "events");
for (const file of fs.readdirSync(eventsPath)) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args));
  else client.on(event.name, (...args) => event.execute(...args));
}
console.log("Has TOKEN ?", process.env.TOKEN ? "YES" : "NO");
client.login(process.env.TOKEN);
