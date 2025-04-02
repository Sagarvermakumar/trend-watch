import mongoose from "mongoose";

const TrendingDiscordMessageSchema = new mongoose.Schema(
  {
    messageId: String,
    channelId: String,
    serverId: String,
    content: String,
    author: String,
    reactions: Number,
    engagementScore: Number,
  },
  { timestamps: true }
);

TrendingDiscordMessageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
);
const TrendingDiscordMessage = mongoose.model(
  "TrendingDiscordMessage",
  TrendingDiscordMessageSchema
);

export default TrendingDiscordMessage;
