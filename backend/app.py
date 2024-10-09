from flask import Flask, request, jsonify
import psycopg2
from google.cloud import storage
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Fetch environment variables
db_user = os.getenv('DB_USER', 'admin1')
db_pass = os.getenv('DB_PASS', 'admin123')
db_name = os.getenv('DB_NAME', 'myappdb')
db_host = os.getenv('DB_HOST', '34.172.172.39')  # Localhost if using Cloud SQL Proxy

os.environ["GCLOUD_PROJECT"] = "ica-1-436122"
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.getenv('CREDENTIALS', "./application_default_credentials.json")

# Set the Google Cloud Storage bucket name
BUCKET_NAME = 'bucket1-ica1'

# Database connection setup
def connect_db():
    conn = psycopg2.connect(
        user=db_user,
        password=db_pass,
        host=db_host,
        database=db_name,
        port=5432  # Default PostgreSQL port
    )
    return conn

# GCP Bucket setup
def upload_to_gcp(file):
    client = storage.Client()
    bucket = client.get_bucket(BUCKET_NAME)
    blob = bucket.blob(file.filename)
    blob.upload_from_file(file)
    return f'File {file.filename} uploaded to GCP Bucket'

# Create positions table if it does not exist
def create_positions_table():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS positions (
            id SERIAL PRIMARY KEY,
            position VARCHAR(100),
            salary NUMERIC
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

# Call the function to create the positions table
create_positions_table()

# Endpoint to insert data into positions table
@app.route('/insert', methods=['POST'])
def insert_data():
    data = request.json
    position = data.get('position')
    salary = data.get('salary')

    conn = connect_db()
    cursor = conn.cursor()
    
    cursor.execute("INSERT INTO positions (position, salary) VALUES (%s, %s)", (position, salary))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Data inserted successfully"}), 201

# Endpoint to fetch data from positions table
@app.route('/get', methods=['GET'])
def get_data():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM positions")
    positions = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(positions)

# Endpoint to delete a position from the positions table
@app.route('/delete/<int:position_id>', methods=['DELETE'])
def delete_position(position_id):
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM positions WHERE id = %s", (position_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Position deleted successfully"}), 200

# Endpoint to upload a file to GCP bucket
@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if not file:
        return jsonify({"message": "No file provided!"}), 400
    
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    message = upload_to_gcp(file)
    return jsonify({"message": message})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
