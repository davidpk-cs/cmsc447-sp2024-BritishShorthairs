import sqlite3

connected = sqlite3.connect('database.db') #connects to database.db file
print("database.db connected successfully") #print statemnet for confirm

#INITIALIZE table named info

connected.execute('CREATE TABLE highscores (username TEXT, points TEXT)')
print("Table created successfully")#print statemnet for confirm

# DROP data table (clear all info)
#connected.execute('DROP TABLE highscores') 
#print("Table dropped successfully")#print statemnet for confirm

connected.close() #close connection
print("Session closed successfully")