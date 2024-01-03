from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo



app = Flask(__name__)
app.config['MONGO_URI']= 'mongodb+srv://davidchuang5:Andyir0ns@codesmithgradtest.akyjqlo.mongodb.net/test?retryWrites=true&w=majority' 
mongo = PyMongo(app)
CORS(app, origins="http://localhost:8000")

if mongo.cx is not None:
  print("connected to mongo")

@app.route("/")
def home():
 return 'Hello World!'


@app.route("/fetchBooks", methods=['GET'])
def fetchBooks():
  collection = mongo.db.books.find()
  book_names = []
  for book in collection:
   book_names.append(book['name'])
 #book_names = [book['name'] for book in collection] #list comprehension method which is a python method simplyfying for loops
  print('list of books', book_names)
  #book_list = ''.join(['<li>{}</li>'.format(book) for book in book_names])
  #Above code is if you want to perform the rendering logic in the backend
  #We comment this out for now because I want this logic to happen in the frontend instead
  #We shall pass the book_names array to the frontend and has it parse with json() for rendering
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




@app.route("/test")
def test():
  return "This is a test"



if __name__ == "__main__":
  app.run(debug=True)