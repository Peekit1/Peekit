# 1. On utilise Node.js
FROM node:18-alpine

# 2. Dossier de travail
WORKDIR /app

# 3. On copie le package.json (qui est maintenant bien présent !)
COPY package*.json ./

# 4. On installe les dépendances
RUN npm install

# 5. On copie tout le code source
COPY . .

# 6. On construit le site (Vite va créer un dossier 'dist')
RUN npm run build

# 7. On installe le serveur web
RUN npm install -g serve

# 8. On lance le serveur sur le dossier 'dist' avec le port de Google
CMD serve -s dist -l $PORT
