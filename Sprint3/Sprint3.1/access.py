from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)

#This displays the homePage
@app.route('/')
def home():
    return render_template('homePage.html')

#currently what takes in usernames and the list
@app.route('/index')
def index():
    return render_template('index.html')

@app.route("/grid")
def gridPage():
    return render_template('grid.html')

#newGame dummy template
@app.route('/newGame')
def newGame():
    return render_template('main.html')
@app.route('/input')
def input():
    return render_template('inputUser.html')

#shows all the highscores in the database
@app.route('/request', methods=['GET'])
def giveData():
    connection = sqlite3.connect('highscores.db')

    cursor = connection.cursor()

    cursor.execute(f'SELECT * FROM scoreTable')

    rows = cursor.fetchall()

    return jsonify(rows)

@app.route('/delete', methods=['POST'])
def deleteEntry():

    data = request.get_json()
    user = data.get('data')

    connection = sqlite3.connect('highscores.db')
    cursor = connection.cursor()
    cursor.execute("DELETE FROM scoreTable WHERE name = ?", (user,))

    connection.commit()

    return jsonify("Successful Delete")


@app.route('/add', methods=['POST'])
def addEntry():
    #gets data from the script.js file 
    data = request.get_json()
    info = data.get('data')

    tuple_info = (info[0], int(info[1]), int(info[2]))

    #puts into the database
    connection = sqlite3.connect('highscores.db')
    cursor = connection.cursor()
    cursor.execute('INSERT OR IGNORE INTO scoreTable (name, id, points) VALUES (?, ?, ?)', tuple_info)


    connection.commit()
    return jsonify("Successful Add")


@app.route('/search', methods=['POST'])
def search():

    data = request.get_json()
    info = data.get('data')

    searchType = info[1]

    columnName = ""

    if(searchType == "Search Score"):
        columnName = "points"
    elif(searchType == "Search Name"):
        columnName = "name"

    connection = sqlite3.connect('highscores.db')
    cursor = connection.cursor()
    
    cursor.execute(f'SELECT * FROM scoreTable WHERE {columnName} LIKE ?', ('%' + info[0] + '%',))

    return jsonify(cursor.fetchall())


@app.route('/reset', methods=['GET'])
def reset():
    
    connection = sqlite3.connect('highscores.db')

    cursor = connection.cursor()

    scoreTable = 'scoreTable'

    #scrap the table
    cursor.execute(f'DROP TABLE IF EXISTS {scoreTable}')

    #redo the table
    cursor.execute(f'CREATE TABLE IF NOT EXISTS {scoreTable} (\
                   name TEXT NOT NULL,\
                   id INT PRIMARY KEY NOT NULL,\
                   points INT NOT NULL\
    )')

    #the defaults specified in hw2
    defaultData = [("Alien Invader", 1, 80), ("Jabba the hutt ", 2, 92), ("Darth Vader", 3, 91)]

    for i in defaultData:
        cursor.execute(f'INSERT INTO {scoreTable} (name, id, points) VALUES (?, ?, ?)', i)
        
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify("Reset Successfully")



if __name__ == '__main__':
    


    app.run(debug=True)
