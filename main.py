import os
from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# 1. Configuration de l'API Key (récupérée des variables d'environnement)
api_key = os.environ.get("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("La variable GOOGLE_API_KEY n'est pas définie")

genai.configure(api_key=api_key)

# 2. Configuration du modèle (Code venant de AI Studio, ajustez selon vos besoins)
generation_config = {
  "temperature": 0.9,
  "top_p": 1,
  "top_k": 1,
  "max_output_tokens": 2048,
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", # Ou le modèle que vous avez choisi
    generation_config=generation_config,
)

# 3. La route qui recevra les requêtes
@app.route("/", methods=["POST"])
def generate():
    try:
        data = request.json
        user_prompt = data.get("prompt", "")
        
        if not user_prompt:
            return jsonify({"error": "Prompt manquant"}), 400

        # Appel à Gemini
        response = model.generate_content(user_prompt)
        
        return jsonify({"response": response.text})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Cloud Run injecte la variable PORT (généralement 8080)
    port = int(os.environ.get("PORT", 8080))
    app.run(debug=True, host="0.0.0.0", port=port)