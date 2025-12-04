import os
from flask import Flask, request, render_template_string
import google.generativeai as genai

app = Flask(__name__)

# Récupération de la clé API
api_key = os.environ.get("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# Le modèle
model = genai.GenerativeModel('gemini-1.5-flash')

# Une petite page HTML intégrée dans le code pour faire joli
HTML_PAGE = """
<!DOCTYPE html>
<html>
<head>
    <title>Mon App Gemini</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        textarea { width: 100%; height: 100px; margin-bottom: 10px; }
        button { padding: 10px 20px; background-color: #007bff; color: white; border: none; cursor: pointer; }
        .response { background-color: #f0f0f0; padding: 15px; margin-top: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Posez une question à Gemini 🤖</h1>
    <form method="post">
        <textarea name="prompt" placeholder="Écrivez votre prompt ici...">{{ prompt }}</textarea><br>
        <button type="submit">Envoyer</button>
    </form>
    
    {% if response %}
    <div class="response">
        <strong>Réponse :</strong><br>
        {{ response }}
    </div>
    {% endif %}
</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def home():
    response_text = ""
    user_prompt = ""

    # Si l'utilisateur a cliqué sur "Envoyer"
    if request.method == "POST":
        # On gère le cas JSON (pour les développeurs) ou Formulaire (pour le navigateur)
        if request.is_json:
            user_prompt = request.json.get("prompt")
        else:
            user_prompt = request.form.get("prompt")

        if user_prompt and api_key:
            try:
                ai_response = model.generate_content(user_prompt)
                response_text = ai_response.text
                
                # Si c'était une requête JSON, on renvoie du JSON
                if request.is_json:
                    return {"response": response_text}
            except Exception as e:
                response_text = f"Erreur : {str(e)}"

    # Si l'utilisateur visite juste la page (GET), on affiche le HTML
    return render_template_string(HTML_PAGE, response=response_text, prompt=user_prompt)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
