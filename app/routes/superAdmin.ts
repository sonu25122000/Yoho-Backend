import express from "express";
import { superAdminController } from "../controllers/superAdmin";

const router = express.Router();

router.post("/register", superAdminController.register);
router.post("/login", superAdminController.login);

export default router;
