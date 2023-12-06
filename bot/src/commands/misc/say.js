const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const messageContent = interaction.options.get("message")?.value;

    if (!messageContent) {
      interaction.reply({
        content: "Please provide a message to send.",
        ephemeral: true,
      });
      return;
    } else {
      interaction.reply({
        content: "Message sent!",
        ephemeral: true,
      });
    }

    await interaction.channel.send(messageContent); // Send the message
  },
  name: "say",
  description: "Makes the bot send a message.",
  options: [
    {
      name: "message",
      description: "The message to be sent.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
