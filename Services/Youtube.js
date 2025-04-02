import axios from "axios";
import Youtube from "../Models/Youtube.js";
import {
  analyzeSentiment,
  extractHashtagsFormDesc,
  getFrequentKeywords
} from "../Utils/Utilities.js";

// 🛠 Function to fetch trending videos from YouTube API and Save it to mongodb database
export const getTrendingVideosFromYoutube = async (
  regionCode,
  maxResult = 5
) => {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResult}&key=${GOOGLE_API_KEY}`;
    const response = await axios.get(url);


    const videos = response.data.items;

    return videos;
  } catch (error) {
    console.error("Error fetching trending videos:", error.message);
    throw new Error("Failed to fetch trending videos from YouTube API");
  }
};

const getTrendingVideoComments = async (videoID, maxResult) => {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

  try {
    const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoID}&maxResults=${maxResult}&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    return response.data.items.map((comment) => ({
      author: comment.snippet.topLevelComment.snippet.authorDisplayName,
      text: comment.snippet.topLevelComment.snippet.textDisplay,
      likeCount: comment.snippet.topLevelComment.snippet.likeCount,
      sentiment: analyzeSentiment(
        comment.snippet.topLevelComment.snippet.textDisplay
      ),
    }));
  } catch (error) {
    console.log(
      `Error Occurred When Fetching Videos Comments : `,
      error.message
    );
  }
};

export const saveToDBLatestVideoWithComment = async function () {
  const trendingVideos = await getTrendingVideosFromYoutube("IN", 50);
  for (const video of trendingVideos) {
    const videoId = video.id;

    const comments = await getTrendingVideoComments(videoId, 30);
    const hashTags = extractHashtagsFormDesc(video.snippet.description);
    const frequentKeywords = getFrequentKeywords(comments);

    // check if the video already exist in the database

    const existingVideo = await Youtube.findOne({ videoId });


    if (existingVideo) {
      //update video with new comments
      existingVideo.comments = comments;
      existingVideo.frequentKeywords = frequentKeywords;
      existingVideo.frequentHashtags = hashTags;
      await existingVideo.save();

      console.log(`Updated comment, keywords and Hashtags  for video : ${videoId}`);
    } else {
      //  if video doesn't exist create new entry
      const newVideo = new Youtube({
        videoId,
        publishedAt: video.snippet?.publishedAt ||  "",
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high.url,
        channelTitle: video.snippet.channelTitle,
        categoryId: parseInt(video.snippet.categoryId) || 0,
        region: "IN",
        language: video.snippet.defaultLanguage,
        viewCount: parseInt(video.statistics.viewCount) || 0,
        likeCount: parseInt(video.statistics.likeCount) || 0,
        favoriteCount: parseInt(video.statistics.favoriteCount) || 0,
        commentCount: parseInt(video.statistics.commentCount) || 0,
        comments,
        frequentKeywords: frequentKeywords,
        frequentHashtags: hashTags,
      });
      await newVideo.save();

      console.log(`New Video save in db :  ${videoId}`);
    }
  }
};
