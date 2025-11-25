const { SlashCommandBuilder } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("honor")
    .setDescription("Play Charlie Kirk"),

  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply("Join a voice channel first.");

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const filePath = path.join(__dirname, "../../../public/kirk.mp3");
    const resource = createAudioResource(filePath);
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    setTimeout(() => {
      player.stop();
      connection.destroy();
    }, 10_000);
  },
};
