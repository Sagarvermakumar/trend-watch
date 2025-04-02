class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  err.message = err.message || "Internal Server error";

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    const errorMessages = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    err.message = errorMessages;
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
