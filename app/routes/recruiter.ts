import express from "express";
import { reCruiterController } from "../controllers/recruiter";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();
router.get("/", reCruiterController.getAllRecruiter);
router.get("/:id", reCruiterController.getRecruiterById);
router.post("/register", reCruiterController.register);
router.post("/login", authenticateToken, reCruiterController.login);
router.patch("/:id", reCruiterController.updateRecruiter);
router.patch("/change-password/:id",reCruiterController.changePassword)
router.delete(
  "/:id",
  authenticateToken,
  reCruiterController.softDeletedRecruiter
);
export default router;
