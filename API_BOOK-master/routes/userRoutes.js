import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController.js";

const router = Router();

// POST /api/auth/signup - Créer un nouvel utilisateur
router.post("/signup", createUser);

// POST /api/auth/login - Authentifier un utilisateur
router.post("/login", loginUser);

export default router;
