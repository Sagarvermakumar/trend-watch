import mongoose from "mongoose";
// This model defines the structure of the YouTube video data that will be stored in the database. It includes fields for video ID, published date, title, description, thumbnail URL, channel title, view count, category ID, language, and tags (like count, favorite count, comment count).

const youtubeVideoSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true, unique: true },
    publishedAt: { type: Date, required: true },
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String, required: true },
    channelTitle: { type: String, required: true },
    categoryId: { type: Number, required: true },
    language: { type: String, default: "en-US" },
    region: { type: String, required: true },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    comments: [
      {
        author: { type: String },
        text: { type: String },
        likes: { type: Number },
        sentiment: { type: String }, // Positive, Negative, Neutral
      },
    ],
    frequentKeywords: [String],  // Array of top keywords
    frequentHashtags: [String],  // Array of top hashtags
    engagementScore: {
      type: Number,
      default: function () {
        return (this.likeCount + this.commentCount) / (this.viewCount || 1);
      },
    },
    sentiment: { type: String, default: "neutral" },
    dateFetched: { type: Date, default: Date.now }, // Date when the video was fetched(dateFetched helps us track when a video trended.)
  },

  { timestamps: true }
);

// TTL Index to delete documents older than 30 days
youtubeVideoSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Youtube = mongoose.model("YoutubeTrendingPost", youtubeVideoSchema);

export default Youtube;
