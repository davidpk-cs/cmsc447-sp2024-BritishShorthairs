from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)

'''def set_player_name(name):
    #global var 
    global curr_player
    #
    curr_player = name
    print(curr_player)

#init globals
curr_player = ""'''

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


@app.route('/level2')
def level2():
    return render_template('level2.html')

@app.route('/level3')
def level3():
    return render_template('level3.html')

@app.route('/levelEndess')
def levelEndless():
    return render_template('levelEndless.html')

@app.route('/input')
def input():
    return render_template('inputUser.html')

#this will be a route to return players to their levels
@app.route('/returnPlayer', methods=['POST'])
def returnPlayer():
    data = request.json
    name = data.get('username')

    connection = sqlite3.connect('highscores.db')
    cursor = connection.cursor()

    #grab the values at each level
    cursor.execute("SELECT level1, level2, level3, final FROM scoreTable WHERE name=?", (name,))
    player_data = cursor.fetchone() #row data
    
    #if player exists then it should go here
    if player_data:
        level1, level2, level3 = player_data[0], player_data[1], player_data[2]
        
        if level1 == 0:
            return jsonify({'redirect': '/newGame'}) #level 1
        elif level2 == 0:
            return jsonify({'redirect': '/level2'}) #level 2
        elif level3 == 0:
            return jsonify({'redirect': '/level3'}) #level 3
        else:
            return jsonify({'redirect': '/levelEndess'}) #ROUTE IS CALLED levelEndess i think its supposed to be levelEndless
    else:
        return jsonify({'error': 'Player not found'})
    


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
    #new data should be 0 at add
    tuple_info = (info[0], int(info[1]),int(info[2]), int(info[3]),int(info[4]))

    #puts into the database
    connection = sqlite3.connect('highscores.db')
    cursor = connection.cursor()
    # each level has different score
    cursor.execute('INSERT OR IGNORE INTO scoreTable (name, level1,level2,level3,final) VALUES (?,?,?,?,?)', tuple_info)


    connection.commit()
    #call set global var for curr_player
    #set_player_name(info[0])

    return jsonify("Successful Add")


@app.route('/search', methods=['POST'])
def search():

    data = request.get_json()
    info = data.get('data')

    searchType = info[1]

    columnName = ""

    if(searchType == "Search Final"):
        columnName = "final"
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

    #redo the table new additional values
    cursor.execute(f'CREATE TABLE IF NOT EXISTS {scoreTable} (\
                   name TEXT NOT NULL,\
                   level1 INT NOT NULL,\
                   level2 INT NOT NULL,\
                   level3 INT NOT NULL,\
                   final INT NOT NULL\
    )')

    #the defaults specified in hw2
    defaultData = [("Alien Invader", 10,20,30,40), ("Jabba the hutt ",95,97,98,100), ("Darth Vader",91,0,0,0)]

    for i in defaultData:
        cursor.execute(f'INSERT INTO {scoreTable} (name, level1,level2,level3,final) VALUES (?, ?, ?, ?,?)', i)
        
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify("Reset Successfully")

#uodates the scores according during gameplay
@app.route('/updateScore', methods=['POST'])
def updateScore():
    #grab sdata sent
    data = request.get_json()
    username = data.get('username')
    newScore = data.get('score')
    level = data.get('level')


    connection = sqlite3.connect('highscores.db')
    cursor = connection.cursor()
    #sql cmd to match score to username 
    if level == 'level1':
        cursor.execute("UPDATE scoreTable SET level1 = ? WHERE name = ?", (newScore, username))
    elif level == 'level2':
        cursor.execute("UPDATE scoreTable SET level2 = ? WHERE name = ?", (newScore, username))
    elif level == 'level3':
        cursor.execute("UPDATE scoreTable SET level3 = ? WHERE name = ?", (newScore, username))
    elif level == 'final':
        cursor.execute("UPDATE scoreTable SET final = ? WHERE name = ?", (newScore, username))
    else:
        return jsonify("Invalid level specified")
    connection.commit()

    connection.close()

    return jsonify("Score Updated Successfully")

'''#for the URI call
@app.route('/sendTopScores',methods=['POST'])
def sendTopScores():
    #connect to db 
    connection = sqlite3.connect('highscores.db')
    cursor = connection.cursor()

    #get the scores of players and sort them in descending order 
    cursor.execute("SELECT name, final FROM scoreTable ORDER BY final DESC LIMIT 5")
    top_scores = cursor.fetchall()
    connection.close()
    player_data_list = []
    for i, score in enumerate(top_scores):
        player_data = {
            f"{i+1} Name": score[0],
            f"{i+1} Score": score[1]
        }
        player_data_list.append(player_data)

    data = {
        "data": [
            {
                "Group": "British Shorthairs", 
                "Title": "Top 5 Scores",
                "1 Name": player_data_list[0]["1 Name"],
                "1 Score": player_data_list[0]["1 Score"],
                "2 Name": player_data_list[1]["2 Name"],
                "2 Score": player_data_list[1]["2 Score"],
                "3 Name": player_data_list[2]["3 Name"],
                "3 Score": player_data_list[2]["3 Score"],
                "4 Name": player_data_list[3]["4 Name"],
                "4 Score": player_data_list[3]["4 Score"],
                "5 Name": player_data_list[4]["5 Name"],
                "5 Score": player_data_list[4]["5 Score"],
            }
        ]
    }
    try:
        #try to send response
        response = request.post("https://eope3o6d7z7e2cc.m.pipedream.net", json=data)
        response.raise_for_status()  
        return jsonify( "Top scores sent successfully."), 200
    #o.w. throw an error
    except request.RequestException as e:
        return jsonify({"error": str(e)}), 500
'''

############# Beyond this point are functions for materials.db ###################

@app.route('/createMaterial', methods=['GET'])
def createMaterial():
    
    connection = sqlite3.connect('materials.db')

    cursor = connection.cursor()

    materialsTable = 'materialsTable'

    #scrap the table
    cursor.execute(f'DROP TABLE IF EXISTS {materialsTable}')

    #redo the table
    cursor.execute(f'CREATE TABLE IF NOT EXISTS {materialsTable} (\
                   materialName TEXT NOT NULL,\
                   quantity INT PRIMARY KEY NOT NULL\
    )')

    #the default materials
    defaultMat = [("planet rock", 1), ("Rock ", 2), ("Orb", 3)]

    for i in defaultMat:
        cursor.execute(f'INSERT INTO {materialsTable} (materialName, quantity) VALUES (?, ?)', i)
        
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify("Reset Materials Successfully")

############## Beyond this point are functions for products.db###################
@app.route('/createProduct', methods=['GET'])
def createProduct():
    
    connection = sqlite3.connect('products.db')

    cursor = connection.cursor()

    productsTable = 'productsTable'

    #scrap the table
    cursor.execute(f'DROP TABLE IF EXISTS {productsTable}')

    #redo the table
    cursor.execute(f'CREATE TABLE IF NOT EXISTS {productsTable} (\
                   productName TEXT NOT NULL,\
                   quantity INT PRIMARY KEY NOT NULL\
    )')

    #tthe default products
    defaultPro = [("Orb Tower", 1), ("Star Tower ", 2), ("Brick Tower", 3)]

    for i in defaultPro:
        cursor.execute(f'INSERT INTO {productsTable} (ProductName, quantity) VALUES (?, ?)', i)
        
    connection.commit()

    cursor.close()
    connection.close()

    return jsonify("Reset Products Successfully")

if __name__ == '__main__':
    


    app.run(debug=True)
