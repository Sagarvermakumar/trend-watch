import Sentiment from "sentiment";

const sentiment = new Sentiment();

export const calculateEngagementScore = (ups, comments, subScribers) => {
  return (ups + comments) / subScribers;
};


