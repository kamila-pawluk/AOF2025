from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins" : ["http://127.0.0.1:5500", "http://localhost:5500",
                     "http://127.0.0.1:5501", "http://localhost:5501"],
        "methods" : ["GET", "POST" ,"PUT", "DELETE"],
        "allow_headers" : ["Content-Type"]
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

@app.route('/tasks', methods=['GET'])
def get_tasks():
    print("GET /tasks endpoint called")
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM todo')
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
def add_task():
    print("POST /tasks endpoint called")
    try:
        data = request.json
        print(f"Received data: {data}")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            '''INSERT INTO todo (title, description, deadline, completed)
               VALUES (%s, %s, %s, %s)''',
            (data['title'], data['description'],
             datetime.fromisoformat(data['deadline']) if data['deadline'] else None,
             False)
        )

        new_id = cursor.lastrowid
        conn.commit()
        conn.close()
        print(f"Task added successfully with ID: {new_id}")
        return jsonify({'success': True, 'id': new_id})
    except Exception as e:
        print(f"Error in add_task: {str(e)}")
        return jsonify({"error": str(e)}), 500 

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''UPDATE todo
           SET completed = %s
           WHERE id = %s''',
        (data['completed'], id)
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
  try:
        print(f"Deleting task with ID: {id}")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('DELETE FROM todo WHERE id = %s', (id,))
        conn.commit()
        if cursor.rowcount == 0:
            print(f"No task found with ID: {id}")
            return jsonify({'success': False, 'message': 'Task not found'}), 404
        print(f"Task with ID {id} deleted successfully")
        conn.close()
        return jsonify({'success': True})
  except Exception as e:
        print(f"Error deleting task with ID {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)   