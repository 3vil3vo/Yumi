const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const Level = require("../../models/Level");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    await interaction.deferReply();

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId level xp"
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let leaderboard = allLevels.slice(0, 10); // get top 10 users

    let leaderboardText = "";
    for (let i = 0; i < leaderboard.length; i++) {
      let user = await client.users.fetch(leaderboard[i].userId);
      leaderboardText += `\`#${i + 1}\` **${user.username}** with **level ${leaderboard[i].level}** and **${leaderboard[i].xp}xp**\n`;
    }

    const userLevel = allLevels.find(
      (level) => level.userId === interaction.user.id
    );
    const userRank =
      allLevels.findIndex((level) => level.userId === interaction.user.id) + 1;

    const embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setDescription("`All-time Rankings`")
      .addFields({
        name: "Your Rank:",
        value: `Your rank is \`#${userRank}\` with **${userLevel.xp}xp.**\n\n${leaderboardText}`,
      })
      .setColor("#FFFFFF")
      .setThumbnail("https://cdn.discordapp.com/icons/1172240348890808421/85643aa8a29f2afb7ff6d7cb03cbc5f1.png")
      .setFooter({
        text: `Requested by ${
          interaction.user.username
        } at ${new Date().toLocaleString()}`,
      });

    interaction.editReply({ embeds: [embed] });
  },
  name: "leaderboard",
  description: "Shows the server leaderboard.",
};
