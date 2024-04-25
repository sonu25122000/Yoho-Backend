import express from "express";
import { reCruiterController } from "../controllers/recruiter";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();
router.get("/",authenticateToken, reCruiterController.getAllRecruiter);
router.get("/:id",authenticateToken, reCruiterController.getRecruiterById);
router.post("/register",authenticateToken, reCruiterController.register);
router.post("/login",authenticateToken, authenticateToken, reCruiterController.login);
router.patch("/:id",authenticateToken, reCruiterController.updateRecruiter);
router.patch("/change-password/:id",authenticateToken,reCruiterController.changePassword)
router.delete(
  "/:id",
  authenticateToken,
  reCruiterController.softDeletedRecruiter
);
export default router;
