const dotenvResult = require("dotenv");
dotenvResult.config();

if (dotenvResult.error) {
  console.error("Error loading .env file:", dotenvResult.error);
}
// config.ts
export const SUPERADMIN_JWT_SECRET =
  process.env.SUPERADMIN_JWT_SECRET || "default_secret_key";

export const SUPERADMIN_SALT = process.env.SUPERADMIN_SALT || 10;
