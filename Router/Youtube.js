import { Router } from "express";

import {
  todaysTrendingPost,
  shortTrendingPost,
  getTrendingPost,
  filterTrendingPost,
} from "../Controllers/Youtube.js";
import { isAuthenticate } from "../Middleware/IsAuthenticated.js";
const router = Router();

// Route to fetch trending posts from YouTube based on region code
router.get("/posts/:regionCode", isAuthenticate, getTrendingPost);

// Route to filter videos by provided query
router.get("/search", isAuthenticate, filterTrendingPost);

// sort trending post by (engagementScore,viewCount,likeCount, commentCount)
router.get("/sort", isAuthenticate, shortTrendingPost);

// whats trending today
router.get("/now", isAuthenticate, todaysTrendingPost);

export default router;
