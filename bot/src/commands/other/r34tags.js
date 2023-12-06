const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const axios = require("axios");
const xml2js = require("xml2js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    let tag = interaction.options.getString("tag");
    tag = tag.replace(/ /g, "_"); // Replace spaces with underscores
    const tag_url = `https://api.rule34.xxx/index.php?page=dapi&s=tag&q=index&name_pattern=${tag}`;

    try {
      // Fetching tags
      const tag_response = await axios.get(tag_url);
      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(tag_response.data);

      if (!result.tags || !result.tags.tag) {
        await interaction.editReply(
          "No tags found with that name. Try a different one!"
        );
        return;
      }

      // Extracting tag names
      const tag_names = result.tags.tag.map((tag) => tag.$.name);

      // Paginating tags (9 per page)
      const page_size = 9;
      let page = 1;

      const updateMessage = async () => {
        const start_index = (page - 1) * page_size;
        const end_index = start_index + page_size;
        const current_tags = tag_names.slice(start_index, end_index);

        // Creating the embed
        const embed = new EmbedBuilder()
          .setTitle("Choose a Tag:")
          .setColor(0x00ff00);

        current_tags.forEach((tag_name, i) => {
          embed.addFields({
            name: `**Option ${i + 1}**`,
            value: `\`${tag_name}\``,
          });
        });

        embed.setFooter({
          text: `Page ${page}/${Math.ceil(tag_names.length / page_size)}`,
        });

        // Creating the buttons
        const row = new ActionRowBuilder();

        const previousButton = new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("Previous")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 1);

        const nextButton = new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page * page_size >= tag_names.length);

        row.addComponents(previousButton, nextButton);

        const message = await interaction.editReply({
          embeds: [embed],
          components: [row],
        });

        // Adding number reactions
        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
        for (let i = 0; i < current_tags.length; i++) {
          await message.react(emojis[i]);
        }

        return message;
      };

      let message = await updateMessage();

      // Creating a collector for button interactions
      const collector = interaction.channel.createMessageComponentCollector({
        time: 60000,
      });

      collector.on("collect", async (buttonInteraction) => {
        if (buttonInteraction.user.id !== interaction.user.id) return;

        if (buttonInteraction.customId === "previous") {
          page--;
        } else if (buttonInteraction.customId === "next") {
          page++;
        }

        await buttonInteraction.deferUpdate();
        message = await updateMessage();
      });

      collector.on("end", () => {
        interaction.editReply({ components: [] });
      });

      // Creating a collector for reaction interactions
      const filter = (reaction, user) => {
        return (
          ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"].includes(
            reaction.emoji.name
          ) && user.id === interaction.user.id
        );
      };

      const reactionCollector = message.createReactionCollector({
        filter,
        time: 60000,
      });

      reactionCollector.on("collect", async (reaction, user) => {
        const index = [
          "1️⃣",
          "2️⃣",
          "3️⃣",
          "4️⃣",
          "5️⃣",
          "6️⃣",
          "7️⃣",
          "8️⃣",
          "9️⃣",
        ].indexOf(reaction.emoji.name);
        const chosen_tag = tag_names[index];

        // Use the chosen tag
        const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${chosen_tag}&json=1`;

        axios.get(url).then(async (response) => {
          const data = response.data;
          if (!data.length) {
            interaction.editReply(
              "No images found with that tag. Try a different one!"
            );
            return;
          }

          const post = data[Math.floor(Math.random() * data.length)];
          const image_url = post["file_url"];

          // Update the embed
          const embed = new EmbedBuilder()
            .setTitle(`Tag: \`${chosen_tag}\``)
            .setColor(0x00ff00)
            .setImage(image_url)
            .setFooter({
              text: `Requested by ${interaction.user.username}`,
            });

          await interaction.editReply({ embeds: [embed], components: [] });
          await message.reactions.removeAll();
        });
      });
    } catch (error) {
      console.error(error);
    }
  },

  deleted: true,
  name: "r34tags",
  description: "Fetches tags from rule34 with the specified pattern",
  options: [
    {
      name: "tag",
      description: "The tag pattern to search for",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
