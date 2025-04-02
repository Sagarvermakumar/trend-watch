import mongoose from "mongoose";
const TrendingRedditPostSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: [true, "Please Provide Post ID"],
      unique: true,
    },
    author: {
      type: String,
      required: [true, "Please Provide Post Author Name"],
    },

    title: { type: String, required: [true, "Please Provide Post Title"] },

    subreddit: {
      type: String,
      required: [true, "Please Provide Subreddit (Category Of Post)"],
    },
    subRedditSubscribers: {
      type: Number,
      required: [
        true,
        "Please Provide Number of Subscriber (Subscribers of the Reddit user whose post it is )",
      ],
    },

    url: { type: String, required: [true, "Please Provide Content Url"] },
    postUrl: { type: String, required: [true, "Please Provide Post Url"] },

    postPublishedAt: {
      type: Date,
      required: [true, "Please Provide Post Published Date"],
    },

    isVideo: { type: Boolean, default: false },
    ups: {
      type: Number,
      required: [true, "Please Provide Number of Up votes"],
    },
    downVotes: {
      type: Number,
      required: [true, "Please Provide Number of Down votes"],
    },
    upVoteRatio: {
      type: Number,
      required: [true, "Please Provide Up Vote Ratio"],
    },
    numOfComments: {
      type: Number,
      required: [true, "Please Provide Number of Comments"],
    },
    score: { type: Number, required: [true, "Please Provide Score"] },
    comments: [
      {
        author: { type: String },
        body: { type: String },
        likes: { type: Number },
        sentiment: { type: String }, // Positive, Negative, Neutral
      },
    ],
    frequentKeywords: [String], // Array of top keywords
    frequentHashtags: [String], // Array of top hashtags
    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    fetchedAt: { type: Date, default: Date.now },

    engagementScore: {
      type: Number,
      default: 0,
    },
    region: { type: String, required: true },
    postTrendingType: {
      type: String,
      enum: [
        "popular",
        "upVoted",
        "recent",
        "trending",
        "controversial",
        "global",
      ],
      required: [true, "Please Provide Post Trending Type"],
    },
  },

  {
    timestamps: true,
  }
);

// TTL Index to delete documents older than 30 days
TrendingRedditPostSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
);

const TrendingRedditPost = mongoose.model(
  "TrendingRedditPost",
  TrendingRedditPostSchema
);

export default TrendingRedditPost;
