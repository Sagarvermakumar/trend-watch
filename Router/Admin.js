import { Router } from "express";
import { isAdmin, isAuthenticate } from "../Middleware/isAuthenticate.js";
import { deleteAllUsers, getAllUsers } from "../Controllers/Admin.js";

const router = Router();

// @Admin routes
router.get("/get-all-users", isAuthenticate, isAdmin, getAllUsers);
router.delete("/delete-all-users", isAuthenticate, isAdmin, deleteAllUsers);
export default router;
