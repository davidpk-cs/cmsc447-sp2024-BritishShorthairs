"""
    a FAF production
    
    Will include some flask details here
"""

# imports - install flask...
from flask import Flask, render_template, request, url_for, abort, redirect, flash
import sqlite3
 
app = Flask(__name__)

# my secret key
app.config['SECRET_KEY'] = 'after 7 - sara smile'

# my methods
# connect to sqlite
def get_db_connection():
    pass

# grab a user's id for create/delete
def get_user(user_id):
    pass

print("Hello guys, gals, and all others")

