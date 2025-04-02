import catchAsyncError from "../Middleware/CatchAsyncError.js";
import User from "../Models/User.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { sendToken } from "../Utils/SendToken.js";

export const createUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, country } = req.body;

  if (!name || !email || !password || !country) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  let userExists = await User.findOne({ email }).select("+password");

  if (userExists) return next(new ErrorHandler("User Already Exist", 400));
  const user = await User.create({
    name,
    email,
    password,
    country,
  });

  sendToken(res, user, "Registered Successfully", 201);
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Please provide all fields", 404));

  let user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid email or password", 404));

  const isMatchPassword = await user.matchPassword(password);

  if (!isMatchPassword) {
    return next(new ErrorHandler("Invalid Email or Password", 404));
  }

  sendToken(res, user, "Login Successfully", 200);
});

export const logoutUser = (req, res) => {
  res
    .cookie("token", "", {
      expire: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "User Logged out Successfully",
    });
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched",
    user: req.user,
  });
};

// @change password
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(
      new ErrorHandler("Please provide both old and new passwords", 400)
    );
  }
  console.log("req.user._id : ", req.user._id);
  const user = await User.findById(req.user._id).select("+password"); // Ensure password field is selected

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Compare old password with stored password
  const isMatch = await user.matchPassword(oldPassword); // Ensure comparePassword is defined in your model

  if (!isMatch) {
    return next(new ErrorHandler("Incorrect old password", 401));
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const instagramOAuth = catchAsyncError(async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return next(new ErrorHandler("Authorization Key Missing", 400));
  }

  console.log(process.env.INSTAGRAM_CLIENT_ID);
  const response = await axios.post(
    "https://api.instagram.com/oauth/access_token",
    {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:4000/auth/instagram/callback",
      code,
    }
  );

  const { access_token, user_id } = response.data;

  // Store access_token in database for future API calls
  res.json({ access_token, user_id });
});
export const instagramOAuthCallback = catchAsyncError(async (req, res) => {
  try {
    res.status(200).redirect("https://saasify-seven.vercel.app/");
  } catch (error) {
    console.error("Error exchanging code for token:", error.response.data);
    res.status(500).send("Failed to authenticate");
  }
});
