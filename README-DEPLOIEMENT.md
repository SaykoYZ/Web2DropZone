# DropZone — déploiement Render

## Local
`npm install` puis `npm run dev`

## Render
Build: `npm ci && npm run build`
Start: `npm start`
Node: `22`

## Variables
Ajouter `SESSION_SECRET` dans Environment. Utiliser une longue valeur aléatoire.

## Admin
Compte initial: `dropzone@dc.ru` / `123`. Au premier accès, changer le mot de passe.

## Important
Le stockage JSON et les uploads locaux ne sont pas persistants après remplacement/redéploiement d'instance. Pour une boutique durable, connecter PostgreSQL/Supabase et un stockage objet.
