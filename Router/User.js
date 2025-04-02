import { Router } from "express";
import {
  changePassword,
  createUser,
  getMyProfile,
  instagramOAuthCallback,
  instagramOAuth,
  loginUser,
  logoutUser,
} from "../Controllers/User.js";
import { isAuthenticate } from "../Middleware/IsAuthenticated.js";

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", isAuthenticate, getMyProfile);

router.put("/change-password", isAuthenticate, changePassword);



router.get("/instagram/callback",  instagramOAuth)
router.get("/instagram",  instagramOAuth)

export default router;
