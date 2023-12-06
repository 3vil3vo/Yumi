const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  PermissionFlagsBits,
} = require("discord.js");

let uptimeStart = Date.now();

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const totalSeconds = (Date.now() - uptimeStart) / 1000;
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds % 60);

    await interaction.reply(
      `Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`
    );
  },
  name: "uptime",
  description: "Get the uptime of the bot",
  options: [],
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
