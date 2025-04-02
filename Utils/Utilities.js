import Sentiment from "sentiment";
import natural from "natural";
import pkg from "stopword";

const stopword = pkg;

const tokenizer = new natural.WordTokenizer();
const sentiment = new Sentiment();

export const calculateEngagementScore = (views, likes, comments) => {
  if (views < 0 || likes < 0 || comments < 0) {
    console.error("Views, likes, and comments must be non-negative numbers.");
    throw new Error("Views, likes, and comments must be non-negative numbers.");
  }
  return (likes * 2 + comments * 3 + views * 0.5) / 1000;
};

/// Function to analyze sentiment of a given text
export const analyzeSentiment = (text) => {
  if (!text) return "neutral"; // Handle empty or undefined text
  const result = sentiment.analyze(text);
  if (result.score > 0) return "positive";
  if (result.score < 0) return "negative";
  return "neutral";
};

// Extracting Frequent Words (Keywords) from Comments
export const getFrequentKeywords = (comments) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    console.log("No comments to process.");
    return [];
  }

  const words = comments.map((comment) => {
    if (comment.text && typeof comment.text === "string") {
      return tokenizer.tokenize(comment.text.toLowerCase());
    }
    return [];
  });

  const allWords = [].concat(...words); // Flatten the array

  const filteredWords = stopword.removeStopwords(allWords);

  // Use reduce to count word frequency
  const wordFrequency = filteredWords.reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1; // Increment count
    return freq;
  }, {});

  // Sort words by frequency & extract only words (not counts)
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1]) // Sort by count (descending)
    .map(([word]) => word); // Extract only words

  return sortedWords; // Return top 10 keywords
};

// Extracting Hashtags from Comments

export const extractHashtags = (comments) => {
  if (!Array.isArray(comments) || comments.length === 0) {
    console.log("No comments to process.");
    return [];
  }
  const hashtagRegex = /#\w+/g;
  const allHashtags = comments.map((comment) => {
    const hashtags = comment.body.match(hashtagRegex);
    return hashtags || "";
  });

  // Flatten the array and get unique hashtags only
  const flattenedHashtags = [].concat(...allHashtags);

  // Ensure hashtags are unique and return as an array of strings
  const uniqueHashtags = [...new Set(flattenedHashtags)];

  return uniqueHashtags; // This will be a simple array of strings
};

// extract hashtags from youtube description
export const extractHashtagsFormDesc = (description) => {
  const hashtags = description.match(/#\w+/g) || [];
  console.log("Hash Tags ", hashtags);
  return hashtags;
};
