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

    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
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

    user.balance -= bet;
    await user.save();

    const emojis = ["💎", "💰", "💳"];
    let slots = emojis.map(
      () => emojis[Math.floor(Math.random() * emojis.length)]
    );

    await interaction.editReply(`Spinning... ${slots.join(" ")}`);

    for (let i = 0; i < 2; i++) {
      slots = emojis.map(
        () => emojis[Math.floor(Math.random() * emojis.length)]
      );
      await interaction.editReply(`Spinning... ${slots.join(" ")}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (slots[0] === slots[1] && slots[1] === slots[2]) {
      const winnings = bet * 10;
      user.balance += winnings;
      await user.save();
      await interaction.editReply(
        `Jackpot! You won ${winnings}! ${slots.join(" ")}`
      );
    } else {
      await interaction.editReply(`No luck this time. ${slots.join(" ")}`);
    }
  },

  name: "slots",
  description: "Play a slots game",
  options: [
    {
      name: "bet",
      description: "The amount you want to bet.",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
};
