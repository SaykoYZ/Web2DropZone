# DROPZONE GENERATOR — Vercel Ready

Projet Next.js 15 / TypeScript / Tailwind préparé pour un déploiement Vercel.

## Déploiement recommandé

1. Envoie ce dossier sur GitHub (ne mets jamais `.env` dans Git).
2. Sur Vercel : **Add New Project** → importe le dépôt.
3. Vercel détecte automatiquement Next.js.
4. Dans **Settings → Environment Variables**, ajoute :
   - `SESSION_SECRET` = une longue valeur aléatoire
   - `NEXT_PUBLIC_SITE_URL` = l'URL `https://...vercel.app`
5. Clique sur **Deploy**.

Le `vercel.json`, le moteur Node et les scripts npm sont déjà configurés.

## Important : stockage

La version originale utilisait des fichiers JSON et des uploads dans le disque du serveur.
Sur Vercel, le système de fichiers d'une fonction est éphémère : les modifications ne doivent
pas être considérées comme un stockage permanent.

Cette version est donc **Vercel-safe pour le déploiement et l'exécution** :
- les données initiales sont lues depuis `data/*.json`;
- les écritures Vercel utilisent `/tmp` pour éviter les erreurs de système de fichiers;
- les uploads sont temporaires sur Vercel;
- pour conserver définitivement les utilisateurs, produits, commandes, paramètres et images,
  il faudra ensuite brancher une base de données + un stockage objet (Supabase, Neon, Vercel Blob, etc.).

## Développement local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Puis ouvre `http://localhost:3000`.

## Compte administrateur initial

Email : `dropzone@dc.ru`

Le mot de passe initial est celui défini dans les données du projet. Change-le immédiatement
après connexion si le flux de changement de mot de passe est activé.

## Vérification avant déploiement

```bash
npm ci
npm run build
```

Si ces deux commandes passent localement, le build Vercel utilise la même installation propre.

## Ce qui a été nettoyé pour Vercel

- `.next/` supprimé du ZIP
- `node_modules/` supprimé du ZIP
- `.env` supprimé du ZIP
- `.env.example` ajouté
- `vercel.json` ajouté
- configuration Next simplifiée
- Node >= 20.9 déclaré
- gestion du stockage fichier adaptée à l'environnement Vercel
