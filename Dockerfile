# Utilise une image Python légère
FROM python:3.9-slim

# Définit le dossier de travail
WORKDIR /app

# Copie tous vos fichiers dans le conteneur
COPY . .

# Installe les librairies listées dans requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Lance le serveur (Gunicorn)
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
