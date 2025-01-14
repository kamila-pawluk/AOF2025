from flask import Flask, request, jsonify,  render_template_string

app = Flask(__name__)

# Velkomst-rute
@app.route('/')
def home():
    html_content = """
    <html>
        <head>
            <title>Backend Server</title>
        </head>
        <body>
            <h1>Welcome to the backend server!</h1>
            <p>This is a simple Flask application.</p>
        </body>
    </html>
    """
    return render_template_string(html_content)

# API for Ã¥ motta og sende data
@app.route('/api/data', methods=['GET'])
def receive_data():
    data = request.get_json()  # Henter JSON-data fra klienten
    if not data:
        return jsonify({"error": "Ingen data sendt"}), 400

    # Enkel respons som viser dataen
    name = data.get('name', 'ukjent')
    age = data.get('age')
    return jsonify({"message": f"Hei, {name}! Dataen din er mottatt. {age}"})

if __name__ == '__main__':
    app.run(debug=True)


