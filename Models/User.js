import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      match: [/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter your Password"],
      minLength: [8, "password must be at least 8 character"],
      select: false,
    },

    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    country: {
      type: String,
      required: [true, "Please Select Your Country"],
    },

    isVerified: { type: Boolean, default: false },
    verificationToken: String,
  },
  {
    timeseries: true,
    timestamps: true,
    
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  console.log("verification token : ", token);
  this.verificationToken = token;
  return token;
};
const User = mongoose.models.User || mongoose.model("users", userSchema);

export default User;
