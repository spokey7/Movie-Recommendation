import pickle
import requests
import sqlite3
import eel
import re

# Initialize SQLite database
conn = sqlite3.connect('users.db')
c = conn.cursor()

# Create users table if not exists
c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    email TEXT UNIQUE,
                    username TEXT UNIQUE,
                    password TEXT
                )''')
conn.commit()

# Function to validate email addresses
def is_valid_gmail(email):
    """Check if the provided email is a valid Gmail address."""
    # Regex pattern for Gmail validation
    pattern = r'^[a-zA-Z0-9._%+-]+@gmail\.com$'
    if re.match(pattern, email):
        return True
    else:
        return False

@eel.expose
def registeruser(email, username, password):
    """Register a new user"""
    if not is_valid_gmail(email):
        return False
    try:
        c.execute('INSERT INTO users (email, username, password) VALUES (?,?,?)',
                       (email, username, password))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        # Handle duplicate username or email
        return False

@eel.expose
def loginuser(username, password):
    """Login an existing user"""
    c.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
    user = c.fetchone()
    if user:
        global logged_in_username
        logged_in_username = username
        return True
    else:
        return False


def fetch_poster(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=0d98d75fca8b75bcf7ff118689f99aac"
    data = requests.get(url).json()
    poster_path = data.get('poster_path')
    if poster_path:
        full_path = f"http://image.tmdb.org/t/p/w500/{poster_path}"
        return full_path
    return None

def recommend(movie):
    if movie not in movies['title'].values:
        return [], []

    index = movies[movies['title'] == movie].index[0]
    distances = sorted(list(enumerate(similarity[index])), reverse=True, key=lambda x: x[1])

    recommended_movies_name = []
    recommended_movies_poster = []
    
    for i in distances[0:11]:
        movie_id = movies.iloc[i[0]].movie_id
        poster = fetch_poster(movie_id)
        if poster:
            recommended_movies_poster.append(poster)
            recommended_movies_name.append(movies.iloc[i[0]].title)
    
    return recommended_movies_name, recommended_movies_poster

@eel.expose
def recommend_movie(movie_name):
    return recommend(movie_name)

# Load your data
movies = pickle.load(open('movie_list.pkl', 'rb'))
similarity = pickle.load(open('similarity.pkl', 'rb'))

# Initialize Eel with the web folder
eel.init('web')  # This is the folder where index.html is located

# Start the Eel app
eel.start('page-1.html', size=(2000, 2600))