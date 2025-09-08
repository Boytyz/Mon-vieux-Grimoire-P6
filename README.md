# API BOOK - Instructions de lancement

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration (optionnelle)

Créez un fichier `.env` à la racine du projet :

```
MONGODB_URI=votre_uri_mongodb_atlas (optionnel)
JWT_SECRET=votre_secret_jwt (optionnel)
PORT=4000 (optionnel)
```

### 3. Lancement de l'application

```bash
npm start
```

## 📊 Base de données

L'application fonctionne avec **deux modes automatiques** :

### Mode 1 : MongoDB Atlas (Cloud)

Si vous avez configuré `MONGODB_URI` dans le fichier `.env`, l'application utilisera votre base Atlas.

### Mode 2 : MongoDB Local (Fallback automatique)

Si aucune URI n'est configurée OU si la connexion Atlas échoue, l'application basculera automatiquement vers une base MongoDB locale sur `mongodb://127.0.0.1:27017/catways`.

**⚠️ Important :** Pour le mode local, vous devez avoir MongoDB installé sur votre machine.

## 🔑 Authentification

L'API utilise des tokens JWT. Pour tester les endpoints protégés :

1. Créez un compte : `POST /api/auth/signup`
2. Connectez-vous : `POST /api/auth/login`
3. Utilisez le token dans le header : `Authorization: Bearer <votre_token>`

## 📚 Endpoints disponibles

### Authentification (publics)

- `POST /api/auth/signup` - Créer un compte
- `POST /api/auth/login` - Se connecter

### Livres (consultation publique)

- `GET /api/books` - Tous les livres
- `GET /api/books/:id` - Un livre par ID
- `GET /api/books/bestrating` - Top 3 des livres

### Livres (actions protégées - token requis)

- `POST /api/books` - Créer un livre (avec image)
- `PUT /api/books/:id` - Modifier un livre
- `DELETE /api/books/:id` - Supprimer un livre
- `POST /api/books/:id/rating` - Noter un livre (0-5)

## 🔧 Dépannage

### Erreur de connexion MongoDB

Si vous voyez cette erreur : `MongoNetworkError` ou `ServerSelectionError`

**Solutions :**

1. **Pour MongoDB Atlas :** Vérifiez que votre IP est autorisée dans Network Access
2. **Pour MongoDB Local :** Installez MongoDB Community Edition
3. **Fallback :** L'application essaiera automatiquement le mode local

### Port déjà utilisé

Si le port 4000 est occupé, changez le port dans le fichier `.env` :

```
PORT=3001
```
