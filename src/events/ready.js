"use strict";

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
    
    const commands = [];
    const commandsPath = path.join(__dirname, "..", "commands");
    for (const folder of fs.readdirSync(commandsPath)) {
      const folderPath = path.join(commandsPath, folder);
      for (const file of fs.readdirSync(folderPath)) {
        const command = require(path.join(folderPath, file));
        commands.push(command.data.toJSON());
      }
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
      console.log("Refreshing application (/) commands...");
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: commands }
      );
      console.log("Commands successfully deployed!");
    } catch (error) {
      console.error("Erreur lors du déploiement des commandes :", error);
    }
  },
};
