import { Response } from "express";

export function handleMongoError(error: any, res: Response) {
  const errorCode = error.code || error.name;
  let statusCode = 500;
  let message = "Internal server error";

  switch (errorCode) {
    // console.log(errorCode);
    case 11000:
    case 11001:
      statusCode = 400;
      message = `Duplicate key error: A key ${
        Object.keys(error.keyPattern)[0]
      } with the same values already exists`;
      break;
    case "ValidationError":
      statusCode = 400;
      message = "Validation error: " + error.message;
      break;
    case "CastError":
      statusCode = 400;
      message = "Cast error: Invalid value for " + error.path;
      break;
    case "MongoTimeoutError":
    case "MongoCursorTimeoutError":
      statusCode = 504;
      message = "MongoDB timeout error: Operation timed out";
      break;
    case "MongoNetworkError":
    case "MongoServerSelectionError":
    case "MongoNotPrimaryError":
      statusCode = 503;
      message = "MongoDB network error: Error in network connection";
      break;
    case "MongoServerError":
      // Check for the specific error message
      if (error.message.includes("Transaction numbers are only allowed")) {
        statusCode = 400; // or any appropriate status code
        message =
          "Error registering delivery partner: Transaction numbers are only allowed on a replica set member or mongos";
      } else {
        statusCode = 500;
        message = "MongoDB server error: " + error.message;
      }
      break;
    case "EAUTH":
      if (error.command === "API") {
        statusCode = 404;
        message = "Missing credentials for GMAIL.";
      } else {
        statusCode = 535;
        message =
          "Invalid email authentication credentials. Please check your email provider settings.";
      }
      break;
    default:
      statusCode = 500;
      message = `Internal Server error.${error}`;
      break;
  }

  console.error("MongoDB Error:", error);
  return res.status(statusCode).json({ success: false, message });
}
