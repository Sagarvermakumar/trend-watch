import TrendingDiscordMessage from "../Models/Discord.js";

// Get Top Trending Discord Messages
export const getTrendingMessages = catchAsyncError(async (req, res, next) => {
  const messages = await TrendingDiscordMessage.find()
    .sort({ engagementScore: -1 })
    .limit(20);
  res.status(200).json({ success: true, messages });
});
