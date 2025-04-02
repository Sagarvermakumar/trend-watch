import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { errorMiddleware } from "./Middleware/Error.js";
import redditRouter from "./Router/Reddit.js";
import userRouter from "./Router/User.js";
import youtubeRouter from "./Router/Youtube.js";
import { saveToDBLatestVideoWithComment } from "./Services/Youtube.js";
import { saveToDBLatestRedditPostWithComment } from "./Services/FetchRedditTrends.js";


const app = express();



config({ path: "./.env" });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//middleware
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Viral content analysis API",
  });
});
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/youtube/trending", youtubeRouter);
app.use('/api/v1/reddit/trending', redditRouter)

// DiscordBot(); // Initialize Discord Bot

// fetchTrendingRedditPosts(); 

// saveToDBLatestVideoWithComment();
// saveToDBLatestRedditPostWithComment();


//error middleware
app.use(errorMiddleware);

export default app;
