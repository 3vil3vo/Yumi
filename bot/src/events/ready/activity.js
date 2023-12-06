const { Client, ActivityType } = require("discord.js");

let uptimeStart = Date.now();

module.exports = (client) => {
  let status = [
    {
      name: "after Cosy Corner",
      type: ActivityType.Watching,
    },
    {
      name: "in Cosy Corner",
      type: ActivityType.Playing,
    },
  ];

  setInterval(() => {
    let random = Math.floor(Math.random() * (status.length + 1));

    if (random === status.length) {
      const totalSeconds = (Date.now() - uptimeStart) / 1000;
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor(totalSeconds / 3600) % 24;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const seconds = Math.floor(totalSeconds % 60);

      client.user.setActivity(`Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else {
      client.user.setActivity(status[random]);
    }
  }, 10000);
};
