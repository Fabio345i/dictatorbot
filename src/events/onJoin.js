const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const roleName = 'basic bitch';

    const role = member.guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
      console.error(`Role "${roleName}" not found in guild ${member.guild.name}.`);
      return;
    }

    try {
      await member.roles.add(role);
      console.log(`Assigned "${roleName}" to ${member.user.tag}`);
    } catch (err) {
      console.error(`Failed to assign "${roleName}" to ${member.user.tag}:`, err);
    }
  },
};
