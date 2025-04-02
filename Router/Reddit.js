import { Router } from "express";
import { isAuthenticate } from "../Middleware/IsAuthenticated.js";
import { filterRedditPost, getTrendingPost, shortTrendingPost } from "../Controllers/Reddit.js";

const router = Router();

router.get("/posts", isAuthenticate, getTrendingPost);

// Route to filter videos by provided query
router.get("/search", isAuthenticate, filterRedditPost);

// sort trending post by (engagementScore,viewCount,likeCount, commentCount)
router.get("/posts/sort", isAuthenticate, shortTrendingPost);


export default router;
