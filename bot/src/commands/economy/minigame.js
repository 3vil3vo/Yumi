const { Client, Interaction } = require("discord.js");
const User = require("../../models/User");
const cooldown_users = {};

module.exports = {
  name: "minigame",
  description: "Play a minigame",
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const user_id = interaction.user.id;

    if (cooldown_users[user_id]) {
      await interaction.reply({
        content:
          "You need to wait 5 minutes before you can play this minigame again.",
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (!user) {
        user = new User({
          ...query,
          balance: 0,
        });
      }

      for (let round = 0; round < 3; round++) {
        const target_number = Math.floor(Math.random() * 9) + 1;
        const sentMessage = await interaction.channel.send(
          `Round ${round + 1}: Please react with a number...`
        );

        for (let i = 1; i <= 9; i++) {
          await sentMessage.react(i + "️⃣");
        }

        await sentMessage.edit(
          `Round ${round + 1}: Please react with the number ${target_number}.`
        );
        const filter = (reaction, user) => {
          return (
            user.id === interaction.user.id &&
            reaction.emoji.name === `${target_number}️⃣`
          );
        };

        try {
          await sentMessage.awaitReactions({
            filter,
            max: 1,
            time: 2000,
            errors: ["time"],
          });
        } catch (error) {
          await interaction.followUp(
            `${interaction.user.toString()}, you did not react in time. Try again in 5 minutes.`
          );
          cooldown_users[user_id] = true;
          setTimeout(() => delete cooldown_users[user_id], 300000);
          return;
        }
      }

      const winnings = Math.floor(Math.random() * 200) + 1;
      user.balance += winnings;
      await user.save();
      await interaction.followUp(
        `Congratulations! You won ${winnings}! Your new balance is ${user.balance}`
      );
    } catch (error) {
      console.log(`Error with /minigame: ${error}`);
    }
  },
};
