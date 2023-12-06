const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const bet = interaction.options.get("bet")?.value;
    const number = interaction.options.get("number")?.value;

    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    if (!bet || !number) {
      interaction.reply({
        content:
          "To use the roulette command, use the following format:\n`/roulette [bet] [number]`\nExample: `/roulette 50 7`",
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    const user = await User.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    if (!user || user.balance < bet) {
      interaction.editReply(`You do not have enough balance for this bet.`);
      return;
    }

    if (!(1 <= number && number <= 36)) {
      interaction.editReply(`Please choose a number between 1 and 36.`);
      return;
    }

    user.balance -= bet;
    await user.save();

    const result = Math.floor(Math.random() * 37);

    await interaction.editReply(`Spinning the roulette wheel... 🎰`);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await interaction.editReply(`The roulette wheel landed on ${result}!`);

    if (result === number) {
      const winnings = bet * 36;
      user.balance += winnings;
      await user.save();
      await interaction.followUp(`Congratulations! You won ${winnings}!`);
    } else {
      await interaction.followUp(`No luck this time. Better luck next spin!`);
    }
  },

  name: "roulette",
  description: "Play a roulette game",
  options: [
    {
      name: "bet",
      description: "The amount you want to bet.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "number",
      description: "The number you want to bet on.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};
