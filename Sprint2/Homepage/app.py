# app.py that has different routes for current homepage 
#view score and inputs username

from flask import Flask
from flask import render_template,jsonify
from flask import request, redirect,url_for
import sqlite3

app = Flask(__name__)

#renders the homescreen for the game
@app.route("/")
def homeScreen():
    return render_template('homepage.html')

@app.route("/newGame")
def newGame():
    return render_template('newGame.html')

@app.route('/startGame', methods=['POST'])
def startGame():
    return render_template('newGame.html')


#atm it is just student inputted scores but hopefully we can link scores to usernames
@app.route('/scoreForm',methods=['POST','GET'])
def scoreForm():
       #this gets the data from the user input 
    if request.method == 'POST':
        Username = request.form['Username']
        Points = request.form['Points']
    #using submit button to insert the info into the datbase
        with sqlite3.connect("database.db") as user:
            cur = user.cursor()
            cur.execute('INSERT INTO highscores (username,Points) VALUES (?,?)',(Username,Points))
            user.commit()
         #data is inputted so it should be on the datatable   
        return redirect((url_for('scoreList'))) # CHANGE THIS TO HIGHSCORE TABLE NAME
    else:
        #otherwise reload the form page
        return render_template("scoreForm.html")
    ''' data = request.get_json()
    info = data.get('data')

    player_info = (info[0], int(info[1]))

    connection = sqlite3.connect('database.db')
    cursor = connection.cursor()
    cursor.execute('INSERT OR IGNORE INTO highscores (username,points) VALUES (?, ?)', player_info)

    connection.commit()
    return jsonify("Successful Add")'''

#route to see the table of highscores
@app.route('/scoreList')
def scoreList():
     #access rows inside the table
    connected = sqlite3.connect('database.db')
    connected.row_factory = sqlite3.Row

    cur = connected.cursor()
    #select * shows all data from info
    #rowid is a predefined thing by sqlite3 
    cur.execute('SELECT rowid,* FROM highscores')

    data = cur.fetchall()
    connected.close()
    #send results of the SELECT to the scoreList.html
    return render_template("scoreList.html", data = data) #used in dt for loop user in data 

@app.route('/delete', methods =['POST', 'GET'])
def delete():
    if request.method == 'POST':
        try:
            #use the hidden in
            rowid = request.form['id']
            #connect to the database and use sql cmd to delete data 
            with sqlite3.connect('database.db') as conn:
                cur = conn.cursor()
                cur.execute("DELETE FROM highscores WHERE rowid= "+rowid) 

                conn.commit()
        
        except:
            #if failure revert back to original data before chnages
            conn.rollback()

        finally:
            return redirect(url_for('scoreList'))
        
if __name__ == '__main__':
    app.run(debug=False)
    
