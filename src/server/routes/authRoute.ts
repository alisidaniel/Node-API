import express from "express";
import AuthController from "../controllers/authController";

const router = express.Router();

router.get('/', AuthController.test);

export default router;