import axios from "axios";
import { calculateEngagementScore } from "../Utils/Reddit.js";
import TrendingRedditPost from "../Models/Reddit.js";
import {
  extractHashtags,
  getFrequentKeywords,
  analyzeSentiment,
} from "../Utils/Utilities.js";

const getTrendingRedditPosts = async (subreddit = "all") => {
  const redditCategories = {
    popular: "hot",
    upVoted: "top",
    recent: "new",
    trending: "rising",
    controversial: "controversial",
    global: "top",
  };

  for (const [type, endPoint] of Object.entries(redditCategories)) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/${endPoint}.json?limit=20`;

      const response = await axios.get(url);

      const posts = response.data.data.children;
      const data = {
        posts,
        type,
      };
      return data;
    } catch (error) {
      console.error(`Error fetching ${type} posts from Reddit:`, error);
      return null;
    }
  }
};

async function getRedditPostComments(postId, subreddit) {
  const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json?limit=50`;

  try {
    const response = await axios.get(url);

    // Extract comments from the response
    const comments = response.data[1].data.children
      .map((comment) => ({
        author: comment.data.author,
        body: comment.data.body,
        sentiment: analyzeSentiment(comment.data.body),
        likes: comment.data.ups,
      }))
      .filter((comment) => comment.body)
      .slice(0, 50); // Remove deleted or empty comments

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

export const saveToDBLatestRedditPostWithComment = async function () {
  try {
    console.log("Working 1");
    const trendingRedditPost = await getTrendingRedditPosts();
    console.log("Working 2");

    for (const post of trendingRedditPost.posts) {
      const postData = post.data;

      const comments = await getRedditPostComments(
        postData.id,
        postData.subreddit
      );

      console.log("Working 2.1");
      const hashTags = extractHashtags(comments.body);
      const frequentKeywords = getFrequentKeywords(comments.body);

      const engagementScore = calculateEngagementScore(
        postData.ups || 0,
        postData.num_comments || 0,
        postData.subreddit_subscribers || 1
      );
      console.log("Working 2");

      const existingPost = await TrendingRedditPost.findOne({
        postId: postData.id,
      });

      console.log("Comments : ", comments);
      console.log("hashTags : ", hashTags);
      console.log("frequentKeywords : ", frequentKeywords);
      console.log("engagementScore : ", engagementScore);

      if (existingPost) {
        existingPost.comments = comments;
        existingPost.frequentKeywords = frequentKeywords;
        existingPost.frequentHashtags = hashTags;

        await existingPost.save();

        console.log("A  Reddit post Updated ");
      } else {
        const newPost = new TrendingRedditPost({
          postId: postData.id,
          author: postData.author,
          title: postData.title,
          subreddit: postData.subreddit,
          subRedditSubscribers: postData.subreddit_subscribers,
          url: `https://www.reddit.com/media?url=${postData.url}`,
          postUrl: `https://www.reddit.com${postData.permalink}`,
          postPublishedAt: new Date(postData.created_utc * 1000),
          isVideo: postData.is_video,
          ups: postData.ups || 0,
          downVotes: postData.downs,
          upVoteRatio: postData.upvote_ratio,
          numOfComments: postData.num_comments,
          score: postData.score,
          sentiment: analyzeSentiment(postData.title),
          engagementScore,
          fetchedAt: new Date(),
          region: "global",
          postTrendingType: trendingRedditPost.type,
          comments,
          frequentKeywords: frequentKeywords,
          frequentHashtags: hashTags,
        });

        //save new post
        await newPost.save();

        console.log("A new Reddit post added", newPost.title);
      }
    }
    console.log("Working 3");
  } catch (error) {
    console.log(` Error Save to popular reddit post ${error}  `);
  }
};
