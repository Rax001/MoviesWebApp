from flask import Flask, request
from movies import MoviesDB

# Run with command in terminal: python3 server.py

class MyFlask(Flask):
    def add_url_rule(self, rule, endpoint=None, view_func=None, **options):
        super().add_url_rule(rule, endpoint, view_func, provide_automatic_options=False, **options)

app = MyFlask(__name__)

@app.route("/<path:path>", methods=["OPTIONS"])
def cors_preflight(path):
    response_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", 
        "Access-Control-Allow-Headers": "Content-Type"
    }
    return "", 204, response_headers

@app.route("/movies", methods=["GET"])
def retrieve_movies_collection():
    db = MoviesDB("movies.db")
    movies = db.getMovies()
    return movies, 200, {"Access-Control-Allow-Origin":"*"}

@app.route("/movies/<int:movie_id>", methods=["GET"])
def retrieve_movies_member(movie_id):
    db = MoviesDB("movies.db")
    movie = db.getMovie(movie_id)
    if movie:
        # db.getMovie(movie)
        return [movie], 200, {"Access-Control-Allow-Origin":"*"}
    else:
        return "Movie Not Found", 404, {"Access-Control-Allow-Origin":"*"}

@app.route("/movies/<int:movie_id>", methods=["DELETE"])
def delete_movies_member(movie_id):
    db = MoviesDB("movies.db")
    movie = db.getMovie(movie_id)
    if movie:
        db.deleteMovie(movie['id'])
        return "Deleted", 200, {"Access-Control-Allow-Origin":"*"}
    else:
        return "Movie Not Found", 404, {"Access-Control-Allow-Origin":"*"}

@app.route("/movies", methods=["POST"])
def create_in_movies_collection():
    db = MoviesDB("movies.db")
    print("The request data is: ", request.form)
    title = request.form["title"]
    year = request.form["year"]
    lead_actor = request.form["lead_actor"]
    genre = request.form["genre"]
    duration = request.form["duration"]
    db.createMovie(title, year, lead_actor, genre, duration)
    return "Created", 201, {"Access-Control-Allow-Origin":"*"}

@app.route("/movies/<int:movie_id>", methods=["PUT"])
def update_movie_member(movie_id):
    db = MoviesDB("movies.db")
    movie = db.getMovie(movie_id)
    if movie:
        update_data = request.form
        title = update_data.get("title")
        year = update_data.get("year")
        lead_actor = update_data.get("lead_actor")
        genre = update_data.get("genre")
        duration = update_data.get("duration")
        db.updateMovie(title, year, lead_actor, genre, duration, movie['id'])
        return "Resource updated successfully", 201, {"Access-Control-Allow-Origin":"*"}
    else:
        return "Movie Not Found", 404, {"Access-Control-Allow-Origin":"*"}
def run():
    app.run(port=8080)

if __name__ == "__main__":
    run()