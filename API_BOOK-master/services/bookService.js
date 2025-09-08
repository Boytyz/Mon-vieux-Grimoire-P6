import Book from "../models/Book.js";
import fs from "fs";
import path from "path";

// Récupérer tous les livres
export async function getAllBooks() {
  return await Book.find();
}

// Récupérer un livre par ID
export async function getBookById(id) {
  return await Book.findById(id);
}

// Récupérer les 3 livres avec la meilleure note moyenne
export async function getBestRatedBooks() {
  return await Book.find().sort({ averageRating: -1 }).limit(3);
}

// Créer un nouveau livre
export async function createBook(bookData) {
  const book = new Book({
    ...bookData,
    ratings: [
      {
        userId: { type: String, required: true },
        grade: { type: Number, required: true },
      },
    ],
    averageRating: { type: Number, default: 0 },
  });
  return await book.save();
}

// Mettre à jour un livre
export async function updateBook(id, bookData) {
  return await Book.findByIdAndUpdate(id, bookData, { new: true });
}

// Supprimer un livre
export async function deleteBook(id) {
  const book = await Book.findById(id);
  if (book && book.imageUrl) {
    // Supprimer l'image associée
    const imagePath = book.imageUrl.replace(
      `${process.env.BASE_URL || "http://localhost:4000"}/`,
      ""
    );
    const fullImagePath = path.join(process.cwd(), imagePath);

    if (fs.existsSync(fullImagePath)) {
      fs.unlinkSync(fullImagePath);
    }
  }
  return await Book.findByIdAndDelete(id);
}

// Ajouter une note à un livre
export async function addRating(bookId, userId, rating) {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new Error("Livre non trouvé");
  }

  // Vérifier si l'utilisateur a déjà noté ce livre
  const existingRating = book.ratings.find(
    (r) => r.userId.toString() === userId
  );
  if (existingRating) {
    throw new Error("Vous avez déjà noté ce livre");
  }

  // Ajouter la nouvelle note
  book.ratings.push({ userId, grade: rating });

  // Calculer la nouvelle moyenne
  const totalRatings = book.ratings.length;
  const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
  book.averageRating = Math.round((sumRatings / totalRatings) * 10) / 10; // Arrondir à 1 décimale

  return await book.save();
}

{Book.averageRating > 0
  ? displayStars(book.averageRating)
  : <span>Pas de note</span>
}

