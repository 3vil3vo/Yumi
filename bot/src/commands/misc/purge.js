const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  PermissionFlagsBits,
} = require("discord.js");
const { setTimeout } = require("timers/promises");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    const amount = interaction.options.get("amount")?.value;
    if (!amount || amount < 1 || amount > 100) {
      interaction.reply({
        content: "You need to input a number between 1 and 100.",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const fetched = await interaction.channel.messages.fetch({ limit: amount });

    interaction.channel
      .bulkDelete(fetched, true)
      .then(async (deleted) => {
        const message = await interaction.channel.send(
          `Deleted ${deleted.size} messages.`
        );
        await setTimeout(5000);
        message.delete();
      })
      .catch((error) => {
        console.error(error);
        interaction.editReply(
          "There was an error trying to prune messages in this channel!"
        );
      });
  },
  name: "purge",
  description: "Delete a specified number of messages in the channel",
  options: [
    {
      name: "amount",
      description: "The number of messages to delete",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
