import catchAsyncError from "../Middleware/CatchAsyncError.js";
import Youtube from "../Models/Youtube.js";
import ErrorHandler from "../Utils/ErrorHandler.js";






// This function fetches trending posts from YouTube based on the provided category ID and country code.
export const getTrendingPost = catchAsyncError(async (req, res, next) => {
  const regionCode = req.params.regionCode
    ? req.params.regionCode.toUpperCase()
    : req.user.country.toUpperCase();
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : 1;
  const maxResult = req.query.maxResult ? parseInt(req.params.maxResult) : 10;

  let filter = {};

  filter.region = regionCode;
  filter.categoryId = categoryId;

  console.log("filter Object : ", filter);

  let trendingVideos = await Youtube.find(filter)
    .sort({ viewCount: -1 })
    .limit(maxResult); // Sort by view count in descending order and limit to 10 results

  if (trendingVideos.length === 0) {
    return next(new ErrorHandler("No trending videos found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Trending videos fetched successfully",
    data: trendingVideos,
  });
});

// 🏳️ Filter by Country (Region)
export const filterTrendingPost = catchAsyncError(async (req, res, next) => {
  const { region, category, keyword, startDate, endDate, minViews, maxViews } =
    req.query;

  let filter = {}; // Initialize an empty filter object
  if (region) filter.region = region.toUpperCase();
  if (category) filter.categoryId = parseInt(category);
  if (keyword) filter.title = { $regex: keyword, $options: "i" }; // 🔍 Case-insensitive search
  if (startDate && endDate)
    filter.publishedAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  if (minViews || maxViews)
    filter.viewCount = {
      ...(minViews && { $gte: parseInt(minViews) }),
      ...(maxViews && { $lte: parseInt(maxViews) }),
    };

  const videos = await Youtube.find(filter)
    .sort({
      viewCount: -1,
    })
    .select("-description"); // Exclude the description field from the result

  if (!videos.length)
    return next(new ErrorHandler("No trending videos found", 404));

  res.status(200).json({
    success: true,
    message: "Videos fetched successfully",
    data: videos,
    count: videos.length > 0 ? videos.length : 0,
  });
});

export const shortTrendingPost = catchAsyncError(async (req, res, next) => {
  const region = req.user.country;


  const { sortBy } = req.query;


  // Allowed sorting fields
  const allowedSortFields = [
    "engagementScore",
    "viewCount",
    "likeCount",
    "commentCount",
  ];

  // Validate sortBy field, default to "viewCount"
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "viewCount";


  const sortedPost = await Youtube.find({region})
    .sort({ [sortField]: -1 })
    .select("-description");

  if (!sortedPost.length) {
    return next(new ErrorHandler("No Trending Post Found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Sorted Successfully",
    data:sortedPost
  });
});

// filter data by date
export const todaysTrendingPost = catchAsyncError(async (req, res, next) => {
  const { date, region } = req.query; //// Example: date=2025-03-28

  if (!date) {
    return next(new ErrorHandler("Please provide Date", 400));
  }
  // Convert string date to JavaScript Date Object
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1); //

  try {
    // MongoDB Query to fetch videos for the given date and region
    const videos = await Youtube.find({
      region,
      createdAt: { $gte: startDate, $lt: endDate },
    }).sort({ engagementScore: -1 }); // Sort by engagement score in descending order

    if (videos.length === 0) {
      return next(
        new ErrorHandler("No videos found for the given date range", 404)
      );
    }

    res.status(200).json({
      success: true,
      message: "Videos fetched successfully",
      data: videos,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Error fetching videos", 500));
  }
});



