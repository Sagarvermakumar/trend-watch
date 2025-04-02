import User from "../Models/User.js";




//delete user by id




// delete all users
export const deleteAllUsers = catchAsyncError(async (req,res,next)=>{
    await User.deleteMany();
  
    res.clearCookie('token')
    res.status(200).json({
      success: true,
      message: " All Users deleted Successfully",
    });
  })
  
  export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = await User.find({});
  
    if (!user) return next(new ErrorHandler("User Not Found", 404));
  
    res.status(200).json({
      success: true,
      user,
    });
  });
