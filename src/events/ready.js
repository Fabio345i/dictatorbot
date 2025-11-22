module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
  }
};
