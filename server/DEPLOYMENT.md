# Guide de Déploiement en Production - Restaurant Kolya

Ce guide vous aidera à déployer l'application du restaurant Kolya en production.

## Prérequis

- Node.js (version 14 ou supérieure)
- MongoDB (version 4.4 ou supérieure) - Hébergé sur MongoDB Atlas ou en local
- Un serveur (VPS, AWS, Google Cloud, etc.)
- Un nom de domaine (optionnel mais recommandé)
- Un certificat SSL (Let's Encrypt recommandé)

## 1. Configuration du serveur

### 1.1 Mise à jour du système

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Installation des dépendances

```bash
# Installation de Node.js et NPM
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de PM2 (gestionnaire de processus)
sudo npm install -g pm2

# Installation de Nginx (comme reverse proxy)
sudo apt install -y nginx
```

### 1.3 Configuration du pare-feu

```bash
# Autoriser SSH, HTTP et HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 2. Configuration de la base de données

### 2.1 MongoDB Atlas (recommandé)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un nouveau cluster
3. Créez un utilisateur de base de données avec les privilèges nécessaires
4. Ajoutez votre adresse IP à la liste blanche
5. Obtenez l'URI de connexion

### 2.2 MongoDB en local

```bash
# Installation de MongoDB
sudo apt install -y mongodb

# Démarrer le service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## 3. Déploiement de l'application

### 3.1 Installation des dépendances

```bash
# Se déplacer dans le répertoire du projet
cd /chemin/vers/kolya/server

# Installer les dépendances
npm install --production
```

### 3.2 Configuration de l'environnement

Créez un fichier `.env` à la racine du projet avec les variables d'environnement nécessaires :

```env
NODE_ENV=production
PORT=3000
MONGO_URI=votre_uri_mongodb
JWT_SECRET=un_secret_tres_long_et_securise
JWT_EXPIRE=30d
CLIENT_URL=https://votredomaine.com
```

### 3.3 Construction de l'application

```bash
# Construire l'application (si nécessaire)
npm run build
```

### 3.4 Démarrage de l'application avec PM2

```bash
# Démarrer l'application en arrière-plan
pm2 start server.js --name "kolya-restaurant"

# Configurer PM2 pour démarrer automatiquement au démarrage
pm2 startup
pm2 save
```

## 4. Configuration de Nginx comme reverse proxy

Créez un fichier de configuration pour votre site :

```bash
sudo nano /etc/nginx/sites-available/kolya
```

Ajoutez la configuration suivante :

```nginx
server {
    listen 80;
    server_name votredomaine.com www.votredomaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activez le site et redémarrez Nginx :

```bash
sudo ln -s /etc/nginx/sites-available/kolya /etc/nginx/sites-enabled/
sudo nginx -t  # Tester la configuration
sudo systemctl restart nginx
```

## 5. Configuration du SSL avec Let's Encrypt

```bash
# Installation de Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir un certificat SSL
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com

# Configurer le renouvellement automatique
sudo certbot renew --dry-run
```

## 6. Initialisation des données

### 6.1 Création d'un administrateur

```bash
node scripts/createAdmin.js
```

### 6.2 Importation des plats de démonstration

```bash
node scripts/seedDishes.js
```

## 7. Surveillance et maintenance

### 7.1 Commandes PM2 utiles

```bash
# Voir les logs en temps réel
pm2 logs

# Surveiller les ressources
pm2 monit

# Redémarrer l'application
pm2 restart kolya-restaurant

# Arrêter l'application
pm2 stop kolya-restaurant
```

### 7.2 Sauvegarde de la base de données

Créez un script de sauvegarde (`/chemin/vers/backup.sh`) :

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/chemin/vers/sauvegardes"
mongodump --uri="votre_uri_mongodb" --out="$BACKUP_DIR/$DATE"
```

Rendez-le exécutable et planifiez une tâche cron :

```bash
chmod +x /chemin/vers/backup.sh
crontab -e
```

Ajoutez cette ligne pour une sauvegarde quotidienne à minuit :

```
0 0 * * * /chemin/vers/backup.sh
```

## 8. Mises à jour

Pour mettre à jour l'application :

```bash
# Se déplacer dans le répertoire du projet
cd /chemin/vers/kolya/server

# Récupérer les dernières modifications
git pull

# Réinstaller les dépendances
npm install --production

# Redémarrer l'application
pm2 restart kolya-restaurant
```

## Support

Pour toute question ou problème, veuillez contacter l'équipe de développement.
