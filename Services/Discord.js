import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // to be present on the server
    GatewayIntentBits.GuildMessages, // To read the message
    GatewayIntentBits.MessageContent, // To access the content of the message
    // GatewayIntentBits.GuildMessageReactions, // To read the reactions on the message
  ],
});
export const DiscordBot = () => {

  // When bot is ready
  client.once("ready", () => {
    console.log(`🤖 Bot is online as ${client.user.tag}`);
  });

  // When bot receives a message
  client.on("messageCreate", (message) => {
    console.log(
      `📩 New Message: ${message.content} from ${message.author.tag}`
    );

    if (message.author.bot) return; // Ignore bot messages

    console.log("✅ Message Event Triggered Successfully!");
    // const reactions = message.reactions.cache.reduce(
    //   (acc, react) => acc + react.count,
    //   0
    // );
    // const engagementScore =
    //   message.content.length + message.attachments.size * 10 + reactions * 5;

    // if (engagementScore > 50) {
    //   // High Engagement Posts Save करें
    //   const trendingMsg = new TrendingDiscordMessage({
    //     messageId: message.id,
    //     channelId: message.channelId,
    //     serverId: message.guildId,
    //     content: message.content,
    //     author: message.author.username,
    //     reactions: reactions,
    //     engagementScore: engagementScore,
    //     timestamp: message.createdAt,
    //   });
    //   trendingMsg.save();

      console.log("🔥 Trending Message Saved:", message.content);

      console.log("🔥 Trending Message Saved:", message.content);
    // }
  });

  client
    .login(process.env.DISCORD_tOKEN)
    .then(() => {
      console.log("🤖 Bot is logged in and ready to track messages.");
    })
    .catch((error) => {
      console.error("Error logging in to Discord:", error);
    });
};
