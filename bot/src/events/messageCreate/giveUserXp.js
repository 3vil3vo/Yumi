const { Client, Message } = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const Level = require("../../models/Level");
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldowns.has(message.author.id)
  )
    return;

  const xpToGive = getRandomXp(10, 20);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  const roles = [
    "1172425225472847882",
    "1173502717122072657",
    "1173502795056418886",
    "1173502860919574538",
    "1173502956046393437",
    "1173503023893458984",
    "1173503094424870922",
  ];

  try {
    const level = await Level.findOne(query);

    if (level) {
      level.xp += xpToGive;

      while (level.xp >= calculateLevelXp(level.level)) {
        level.level += 1;

        // Füge die Rolle hinzu, wenn das Level erreicht ist
        const role = message.guild.roles.cache.get(roles[level.level - 1]);
        if (role) {
          message.member.roles.add(role);
          message.channel.send(
            `${message.member} you have leveled up to **level ${level.level}** and have been awarded the "**${role.name}**" role.`
          );
        } else {
          message.channel.send(
            `${message.member} you have leveled up to **level ${level.level}**.`
          );
        }
      }

      while (level.xp < calculateLevelXp(level.level - 1) && level.level > 1) {
        // Entferne die Rolle, wenn das Level sinkt
        const role = message.guild.roles.cache.get(roles[level.level - 1]);
        if (role) {
          message.member.roles.remove(role);
        }
        level.level -= 1;
      }

      // Save the updated level to the database
      await level.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });

      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }

    // if (!level)
    else {
      // create new level
      const newLevel = new Level({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await newLevel.save();
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 120000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};
