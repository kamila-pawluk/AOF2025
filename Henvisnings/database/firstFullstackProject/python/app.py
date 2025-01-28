from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import datetime, timedelta
from jwt import encode, decode
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
CORS(app, resources={
    r"/*": {
        "origins" : ["http://127.0.0.1:5500", "http://localhost:5500",
                     "http://127.0.0.1:5501", "http://localhost:5501"],
        "methods" : ["GET", "POST" ,"PUT", "DELETE"],
        "allow_headers" : ["Content-Type", "Authorization"]
    }
})

def get_db_connection():
    try:
    #     conn = pyodbc.connect(
    #         "Driver={ODBC Driver 17 for SQL Server};"
    #         "Server=(localdb)\\MSSQLLocalDB;"
    #         "Database=kurs_test;"
    #         "Trusted_Connection=yes;"
    #     )
        conn = mysql.connector.connect(
            unix_socket="/tmp/mysql.sock",
            host="127.0.0.1",
            user="root",
            password="Leos1203.",
            database="localDB_kurs"
        )
        print("Database connection successful")
        return conn
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        raise

def get_user(username, password):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM Users WHERE username = %s AND password = %s', (username, password))
    user = cursor.lastrowid
    conn.close()
    return user

@app.route('/login', methods=['POST'])
def login():
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'error': 'Invalid creditentials'}), 401
    user = get_user(auth['username'], auth['password'])

    if not user:
        return jsonify({'error': 'Invalid creditentials'}), 401
    
    token = encode({
        'user': auth['username'],
        'exp' : datetime.utcnow() + timedelta(hours=24)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({'token' : token})

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]
            data = decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            kwargs['username'] = data['user']
        except:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated


@app.route('/tasks', methods=['GET'])
@token_required
def get_tasks(username):
    print("GET /tasks endpoint called")
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
                       SELECT t.*
                       FROM todo t
                       JOIN Users u ON t.userId = u.id
                       WHERE u.username = ?
                       ''', (username,))
        tasks = []
        for row in cursor.fetchall():
            tasks.append({
                'id' : row['id'],
                'title' : row['title'],
                'description' : row['description'],
                'deadline' : row['deadline'].isoformat() if row['deadline']  else None,
                'completed' : bool(row['completed'])
            })
        conn.close()
        print(f"Returning {len(tasks)} tasks")
        return jsonify(tasks)
    except Exception as e:
        print(f"Error in get_tasks: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
# get_tasks()

@app.route('/tasks', methods=['POST'])
@token_required
def add_task(username):
    print("POST /tasks endpoint called")
    try:
        data = request.json
        print(f"Received data: {data}")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('SELECT id FROM Users username = %s', (username))
        user_row = cursor.lastrowid
        if not user_row:
            return jsonify({'error': "User not found"}), 404
        
        user_id = user_row[0]

        cursor.execute(
            '''INSERT INTO todo (title, description, deadline, completed, userId)
               OUTPUT INSERTED.id
               VALUES (%s, %s, %s, %s, %s)''',
            (data['title'], data['description'],
             datetime.fromisoformat(data['deadline']) if data['deadline'] else None,
             False, user_id)
        )

        new_id = cursor.lastrowid[0]
        conn.commit()
        conn.close()
        print(f"Task added successfully with ID: {new_id}")
        return jsonify({'success': True, 'id': new_id})
    except Exception as e:
        print(f"Error in add_task: {str(e)}")
        return jsonify({"error": str(e)}), 500 

@app.route('/tasks/<int:id>', methods=['PUT'])
@token_required
def update_task(id, username):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
                   SELECT t.*
                   FROM todo t
                   JOIN Users u ON t.userId = u.id
                   WHERE t.id = %s AND u.username = %s
                ''', (id, username,))
    
        if not cursor.lastrowid:
            return jsonify({'error': 'Task not found or unauthorized'}), 404

        cursor.execute(
            '''UPDATE todo
            SET completed = %s
            WHERE id = %s''',
            (data['completed'], id)
        )
        conn.commit()
        conn.close()
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error in update_task: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/tasks/<int:id>', methods=['DELETE'])
@token_required
def delete_task(id, username):
  try:
        print(f"Deleting task with ID: {id}")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('''
                       SELECT t.*
                       FROM todo t
                       JOIN Users u ON t.userId = u.id
                       WHERE t.id = %s AND u.username = %s
                    ''', (id, username,))
        
        if not cursor.lastrowid:
                return jsonify({'error': 'Task not found or unauthorized'}), 404

        cursor.execute('DELETE FROM todo WHERE id = %s', (id,))
        conn.commit()
        conn.close()
        return jsonify({'success': True})
  except Exception as e:
        print(f"Error deleting task with ID {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=["POST"])
def register():
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'error': 'Username and password is required'}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute('SELECT * FROM Users WHERE username = %s', (auth['username'],))
        if cursor.lastrowid:
            return jsonify({'error': 'Username already exists'}), 409
        
        cursor.execute('INSERT INTO Users (username, password) VALUES (%s, %s)', 
                       (auth['username'], auth['password']))
        conn.commit()
        conn.close()

        token = encode({
        'user': auth['username'],
        'exp' : datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'token' : token, 'message': 'Registration successful'}), 201
    
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)   