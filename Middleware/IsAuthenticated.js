import jwt from "jsonwebtoken";
import ErrorHandler from "../Utils/ErrorHandler.js";
import User from "../Models/User.js";
import catchAsyncError from "./CatchAsyncError.js";


export const isAuthenticate = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next(new ErrorHandler("Login first...", 400));
  const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodeToken.id);

  next();
});

export const isAdmin = catchAsyncError( async (req, res, next) => {

  // Get the user from the request (assuming the user is already authenticated and the user ID is stored in req.user)
  const user = await User.findById(req.user.id);

  // Check if the user exists and has the 'admin' role
  if (!user || user.role !== 'Admin') {
    return  next(new ErrorHandler("Access denied. Admins only.", 400));
  }

  // If the user is an admin, allow the request to proceed
  next();

})