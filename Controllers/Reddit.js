import catchAsyncError from "../Middleware/CatchAsyncError.js";
import TrendingRedditPost from "../Models/Reddit.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { calculateEngagementScore } from "../Utils/Reddit.js";

// get trending Post

export const getTrendingPost = catchAsyncError(async (req, res, next) => {
  const { type = "global", maxResult = 10 } = req.query;

  const posts = await TrendingRedditPost.find({ postTrendingType: type })
    .sort({
      ups: -1,
    })
    .limit(maxResult);

  if (!posts) {
    return next(new ErrorHandler(`Post not Found, Trending in : ${type}`, 404));
  }

  res.status(200).json({
    success: true,
    message: `Post Fetched , Trending in ${type}`,
    count: posts.length,
    data: posts,
  });
});

export const filterRedditPost = catchAsyncError(async (req, res, next) => {
  const {
    downVotes,
    engagementScore,
    fetchedAt,
    isVideo,
    numOfComments,
    score,
    sentiment,
    upVoteRatio,
    ups,
  } = req.query;

  const { postTrendingType = "global" } = req.params;

  let filter = {};

  filter.postTrendingType = postTrendingType;
  if (downVotes) filter.downVotes = { $gte: Number(downVotes) };
  if (engagementScore)
    filter.engagementScore = { $gte: Number(engagementScore) };
  if (fetchedAt) filter.fetchedAt = { $gte: new Date(fetchedAt) };
  if (isVideo !== undefined) filter.isVideo = isVideo === "true";
  if (numOfComments) filter.numOfComments = { $gte: Number(numOfComments) };
  if (score) filter.score = { $gte: Number(score) };
  if (sentiment) filter.sentiment = sentiment;
  if (upVoteRatio) filter.upVoteRatio = { $gte: Number(upVoteRatio) };
  if (ups) filter.ups = { $gte: Number(ups) };
  console.log("filter : ", filter);
  // Step 2: Query MongoDB with the Filter
  const posts = await TrendingRedditPost.find(filter)
    .sort({ engagementScore: -1 })
    .limit(50);

  console.log(postTrendingType);
  console.log(posts);

  if (!posts.length) {
    return next(new ErrorHandler("Post not Found With this Query"));
  }

  res.status(200).json({
    success: true,
    message: "Post Fetched By provided Query",
    posts,
  });
});

export const shortTrendingPost = catchAsyncError(async (req, res, next) => {
  const { sortBy, type = "global", maxResult = 10 } = req.query;

  // Allowed sorting fields
  const allowedSortFields = [
    "engagementScore",
    "fetchedAt",
    "numOfComments",
    "postPublishedAt",
    "score",
    "ups"
  ];

  // Validate sortBy field, default to "viewCount"
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "ups";

  const sortedPost = await TrendingRedditPost.find({ postTrendingType: type })
    .sort({ [sortField]: -1 })
    .select("-description")
    .limit(maxResult);

  if (!sortedPost.length) {
    return next(new ErrorHandler("No Trending Post Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Sorted Successfully",
    data: sortedPost,
  });
});

// update engagement score of all videos
export const updateEngagementScore = catchAsyncError(async () => {
  try {
    const videos = await Youtube.find();

    for (const video of videos) {
      const engagementScore = calculateEngagementScore(
        video.viewCount,
        video.likeCount,
        video.commentCount
      );
      // Avoid division by zero

      // save engagement score to the database
      await TrendingRedditPost.findOneAndUpdate(
        { _id: video._id },
        { $set: { engagementScore: engagementScore } }, // Update the engagement score field in the database

        { new: true } // Return the updated document
      );

      console.log(
        `Updated engagement score for video: ${video.title} → ${engagementScore}`
      );
    }
  } catch (error) {
    console.error("Error updating engagement score:", error.message);
  }
});
