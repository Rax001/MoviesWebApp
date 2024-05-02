import sqlite3

# def dict_factory(cursor, row):
#     fields = []
#     for column in cursor.description:
#         fields.append(column[0])

#     result_dict = {}
#     for i in range(len(fields)):
#         result_dict[fields[i]] = row[i]
#     return result_dict

def dict_factory(cursor, row):
    fields = [column[0] for column in cursor.description]
    return {key: value for key, value in zip(fields, row)}

class MoviesDB:
    def __init__(self, filename):
        # connect to DB file
        self.connection = sqlite3.connect("movies.db")
        self.connection.row_factory = dict_factory
        self.cursor = self.connection.cursor()
    def getMovies(self):
        self.cursor.execute("SELECT * FROM movies")
        # fetchall - always returns an array of tuples, but could empty
        movies = self.cursor.fetchall()
        # print("movies:", movies)
        return movies
    
    def getMovie(self, movie_id):
        data = [movie_id]
        self.cursor.execute("SELECT * FROM movies WHERE id = ?", data)
        movie = self.cursor.fetchone()
        return movie

    def createMovie(self, title, year, lead_actor, genre, duration):
        data = [title, year, lead_actor, genre, duration]
        # add new movie year
        self.cursor.execute("INSERT INTO movies (title, year, lead_actor, genre, duration) VALUES(?, ?, ?, ?, ?)", data)

        # commit new year
        self.connection.commit()

    def deleteMovie(self, movie_id):
        print(movie_id)
        data = [movie_id]
        self.cursor.execute("DELETE FROM movies WHERE id = ?", data)
        self.connection.commit()

    def updateMovie(self, title, year, lead_actor, genre, duration, movie_id):
        pass
        data = [title, year, lead_actor, genre, duration, movie_id]
        self.cursor.execute("UPDATE movies SET title = ?, year = ?, lead_actor = ?, genre = ?, duration = ? WHERE id = ?", data)
        self.connection.commit()
