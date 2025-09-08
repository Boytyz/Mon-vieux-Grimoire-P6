import * as bookService from "../services/bookService.js";
import fs from "fs";
import path from "path";

// GET /api/books - Récupérer tous les livres
export const getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/books/:id - Récupérer un livre par ID
export const getBookById = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/books/bestrating - Récupérer les 3 livres les mieux notés
export const getBestRatedBooks = async (req, res) => {
  try {
    const books = await bookService.getBestRatedBooks();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/books - Créer un nouveau livre
export const createBook = async (req, res) => {
  try {
    let bookData;

    // Si un fichier est uploadé, les données du livre sont dans req.body.book (string)
    if (req.file) {
      bookData = JSON.parse(req.body.book);
      bookData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    } else {
      return res.status(400).json({ message: "Image requise" });
    }

    // Ajouter l'ID de l'utilisateur authentifié
    bookData.userId = req.user.userId;

    const book = await bookService.createBook(bookData);
    res.status(201).json({ message: "Livre créé avec succès", book });
  } catch (err) {
    // Supprimer le fichier si erreur
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/books/:id - Modifier un livre
export const updateBook = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifier que l'utilisateur est le propriétaire du livre
    if (book.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    let bookData;

    // Si un fichier est uploadé
    if (req.file) {
      bookData = JSON.parse(req.body.book);

      // Supprimer l'ancienne image
      if (book.imageUrl) {
        const oldImagePath = book.imageUrl.replace(
          `${req.protocol}://${req.get("host")}/`,
          ""
        );
        const fullOldImagePath = path.join(process.cwd(), oldImagePath);
        if (fs.existsSync(fullOldImagePath)) {
          fs.unlinkSync(fullOldImagePath);
        }
      }

      bookData.imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    } else {
      // Pas de fichier, les données sont directement dans req.body
      bookData = req.body;
    }

    const updatedBook = await bookService.updateBook(req.params.id, bookData);
    res.json({ message: "Livre modifié avec succès", book: updatedBook });
  } catch (err) {
    // Supprimer le fichier si erreur
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/books/:id - Supprimer un livre
export const deleteBook = async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifier que l'utilisateur est le propriétaire du livre
    if (book.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await bookService.deleteBook(req.params.id);
    res.json({ message: "Livre supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/books/:id/rating - Ajouter une note à un livre
export const addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user.userId;

    // Validation de la note
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être comprise entre 0 et 5" });
    }

    const book = await bookService.addRating(req.params.id, userId, rating);
    res.json(book);
  } catch (err) {
    if (err.message === "Livre non trouvé") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message === "Vous avez déjà noté ce livre") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};
