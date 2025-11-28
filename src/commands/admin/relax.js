const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("relax")
    .setDescription("Send a user to the relaxation chamber (admin only).")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to send to the bad kitten channel")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Relaxation time in seconds")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const target = interaction.options.getMember("user");
    const duration = interaction.options.getInteger("duration") || 60;
    const guild = interaction.guild;

    if (!target) {
      return interaction.reply({ content: "User not found.", ephemeral: true });
    }

    if (!target.voice.channel) {
      return interaction.reply({
        content: "That user is not in a voice channel.",
        ephemeral: true,
      });
    }

    let relaxChannel = guild.channels.cache.find(
      (c) => c.name === "bad kitten" && c.isVoiceBased()
    );

    if (!relaxChannel) {
      relaxChannel = await guild.channels.create({
        name: "bad kitten",
        type: 2, // voice
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: ["Connect"],
          },
        ],
      });
    }

    for (const channel of guild.channels.cache.filter((c) =>
      c.isVoiceBased()
    )) {
      await channel.permissionOverwrites
        .edit(target.id, { Connect: false })
        .catch(() => {});
    }

    await target.voice.setChannel(relaxChannel).catch(() => {});
    await target.voice.setMute(true).catch(() => {});

    const connection = joinVoiceChannel({
      channelId: relaxChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    );
    player.play(resource);
    connection.subscribe(player);

    await interaction.reply({
      content: `😴 ${target.user.username} has been sent to the *bad kitten* chamber for ${duration}s.`,
      ephemeral: false,
    });

    setTimeout(async () => {
      try {
        await target.voice.setMute(false).catch(() => {});
        await connection.destroy();
        for (const channel of guild.channels.cache.filter((c) =>
          c.isVoiceBased()
        )) {
          await channel.permissionOverwrites.delete(target.id).catch(() => {});
        }
        await interaction.followUp({
          content: `${target.user.username} is now free from the *bad kitten* chamber 😌`,
          ephemeral: false,
        });
      } catch (err) {
        console.error("Error releasing user:", err);
      }
    }, duration * 1000);
  },
};
