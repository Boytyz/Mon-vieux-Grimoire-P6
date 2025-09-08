import jwt from 'jsonwebtoken';
import * as userService from '../services/userService.js';

export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (password.length < 5) {
      return res.status(400).json({
        message: 'Le mot de passe doit contenir au moins 5 caractères.',
      });
    }
    const existing = await userService.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }
    const user = await userService.createUser({ email, password });
    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      userId: user._id, // eslint-disable-line no-underscore-dangle
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Email ou mot de passe incorrect.' });
    }
    const bcrypt = await import('bcryptjs');
    const isMatch = await bcrypt.default.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Email ou mot de passe incorrect.' });
    }
    const token = jwt.sign(
      { userId: user._id }, // eslint-disable-line no-underscore-dangle
      process.env.JWT_SECRET || 'votre_secret_jwt', // Utilise la variable d'environnement
      { expiresIn: '8h' },
    );
    return res.json({
      token,
      userId: user._id, // eslint-disable-line no-underscore-dangle
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
