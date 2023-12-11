from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
  return "hello world, from Flask!"

@app.route("/test")
def test():
  return "This is a test"



if __name__ == "__main__":
  app.run(debug=True)