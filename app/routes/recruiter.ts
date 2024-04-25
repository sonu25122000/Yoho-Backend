import express from "express";
import { reCruiterController } from "../controllers/recruiter";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();
router.get("/", reCruiterController.getAllRecruiter);
router.post("/register", reCruiterController.register);
router.post("/login", authenticateToken, reCruiterController.login);
router.patch("/:id", authenticateToken, reCruiterController.updateRecruiter);
router.delete(
  "/:id",
  authenticateToken,
  reCruiterController.softDeletedRecruiter
);
export default router;
