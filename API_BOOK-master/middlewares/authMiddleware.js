import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token d'accès requis" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "votre_secret_jwt"
    );
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide" });
  }
}
