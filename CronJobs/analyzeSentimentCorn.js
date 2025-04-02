import { updateEngagementScore } from "../Controllers/Trends.js";

//
const analyzeSentimentEvery6Hr =  () => {
//   cron.schedule("0 */6 * * *", async () => {
    console.log("analyzing sentiment for all trending videos...");

    // analyzeSentimentsController(); // Call the function to analyze sentiments for all videos
    updateEngagementScore()
//   });
};


export default analyzeSentimentEvery6Hr;
