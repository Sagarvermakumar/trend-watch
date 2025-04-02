import cron from "node-cron";
import { getTrendingVideosFromYoutube } from "../Services/Youtube.js";

const regions = ["US", "IN", "GB", "CA", "AU"]; // 🌍 Multiple regions

// Update data for all regions every 6 hours

const fetchTrendingEvery6Hr = async() => {
  cron.schedule("0 */6 * * *", async () => {
    console.log("Fetching trending videos for all regions...");
    for (const region of regions) {
      try {
        await getTrendingVideosFromYoutube(region); // Fetch trending videos for the region
        console.log(
          `Successfully fetched trending videos for region: ${region}`
        );
      } catch (error) {
        console.error(
          `Error fetching trending videos for region ${region}:`,
          error
        );
      }
    }
    console.log(
      "Finished fetching trending videos for all regions. : ",
      new Date()
    );
  });
};

export default fetchTrendingEvery6Hr;
