import { Router } from "express";
import {
  getAllBooks,
  getBookById,
  getBestRatedBooks,
  createBook,
  updateBook,
  deleteBook,
  addRating,
} from "../controllers/bookController.js";
import upload from "../middlewares/multerMiddleware.js";
import { compressImage } from '../middlewares/sharpMiddleware.js';

const router = Router();

// GET /api/books/bestrating - Doit être AVANT GET /api/books/:id pour éviter les conflits
router.get("/bestrating", getBestRatedBooks);

// GET /api/books - Récupérer tous les livres
router.get("/", getAllBooks);

// GET /api/books/:id - Récupérer un livre par ID
router.get("/:id", getBookById);

// POST /api/books - Créer un nouveau livre (avec upload d'image)
router.post("/", upload.single("image"), createBook);

// PUT /api/books/:id - Modifier un livre (avec upload d'image optionnel)
router.put("/:id", upload.single("image"), updateBook);

// DELETE /api/books/:id - Supprimer un livre
router.delete("/:id", deleteBook);

// POST /api/books/:id/rating - Ajouter une note à un livre
router.post("/:id/rating", addRating);

router.post('/', upload.single('image'), compressImage, createBook);

export default router;
