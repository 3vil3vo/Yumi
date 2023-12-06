const { Schema, model } = require("mongoose");

const backgroundSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  ownedBackgrounds: {
    type: [String],
    default: ["BG1"],
  },
  activeBackground: {
    type: String,
    default: "BG1",
  },
});

module.exports = model("LevelBackground", backgroundSchema);