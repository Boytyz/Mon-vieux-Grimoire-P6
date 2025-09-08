import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const compressImage = async (req, res, next) => {
  if (!req.file) return next(); // Passe si pas de fichier

  try {
    const outputFilename = `compressed-${Date.now()}.webp`;
    const outputPath = path.join('uploads', outputFilename);

    await sharp(req.file.path)
      .resize(1200)
      .webp({ quality: 70 })
      .toFile(outputPath);

    // Supprimer le fichier original pour économiser de l'espace
    fs.unlinkSync(req.file.path); // Supprime l'original
    req.file.filename = outputFilename; // Met à jour le nom
    req.file.path = outputPath;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Compression échouée" });
  }
};
