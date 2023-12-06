// node --expose-gc src/yumi.js
require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");
const v8 = require("v8");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err, origin) => {
  console.log("Caught exception: ", err, "Exception origin: ", origin);
});

setInterval(() => {
  try {
    if (global.gc) {
      global.gc();
    } else {
      console.log(
        "Garbage collection is not exposed. Start your program with the `--expose-gc` flag."
      );
    }
  } catch (e) {
    console.error(`Error in garbage collector: ${e}`);
  }
}, 1000 * 60);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error (DB): ${error}`);
  }
})();
