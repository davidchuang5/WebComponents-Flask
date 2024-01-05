from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import os



app = Flask(__name__)
app.config['MONGO_URI']= 'mongodb+srv://davidchuang5:Andyir0ns@codesmithgradtest.akyjqlo.mongodb.net/test?retryWrites=true&w=majority' 
mongo = PyMongo(app)
CORS(app, origins="http://localhost:8000")

if os.getenv('FLASK_ENV') == 'development':
   app.debug = True

if mongo.cx is not None:
  print("connected to mongo")

@app.route("/")
def home():
 return 'Hello World!'


@app.route("/fetchBooks", methods=['GET', 'OPTIONS'])
def fetchBooks():
  if request.method == 'OPTIONS':
   return jsonify({}), 200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
   }
  collection = mongo.db.books.find()
  book_names = []
  for book in collection:
   book_names.append(book['name'])
  print('list of books', book_names)

  return book_names



@app.route("/addBook", methods=['POST', 'OPTIONS'])
def addBook():
 if request.method == 'OPTIONS':
  # Preflight request. Reply successfully:
  return jsonify({}), 200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

 book_data = request.get_json()
 if book_data:
  collections = mongo.db.books
  collections.insert_one(book_data)
  collection = mongo.db.books.find()
  book_names = []
  for book in collection:
   book_names.append(book['name'])
   print('book_names', book_names)
  return book_names
 else:
  return "Could not add book"

@app.route("/deleteBook", methods=['DELETE', 'OPTIONS'])
def deleteBook():
 if request.method == 'OPTIONS':
  return jsonify({}), 200, {
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type',
 }

 book_data = request.get_json()
 print('book_data', book_data)
 if book_data:
  collections = mongo.db.books
  result = collections.delete_one({'name': book_data['name']})
  print('Deleted count: ', result.deleted_count)

  collection = mongo.db.books.find()
  book_names = []
  for book in collection:
   book_names.append(book['name'])
   print('book_names', book_names)
  return book_names
 else:
  return 'Could not delete book'

@app.route("/edit", methods=['PUT', 'OPTIONS'])
def editBook():
 if request.method == 'OPTIONS':
  return jsonify({}), 200, {
  'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Methods': 'PUT, OPTIONS',
 'Access-Control-Allow-Headers': 'Content-Type',
  }
 book_data = request.get_json()
 if book_data:
  collection = mongo.db.books
  collection.update_one({'name': book_data['oldTitle']}, {'$set': {'name': book_data['newTitle']}})
  bookData = []
  for book in collection.find():
   bookData.append(book['name'])
   print('bookData', bookData)
   return jsonify(bookData)
  else:
   return 'Could not edit book'
   



@app.route("/test")
def test():
  return "This is a test"



if __name__ == "__main__":
  app.run(debug=True)