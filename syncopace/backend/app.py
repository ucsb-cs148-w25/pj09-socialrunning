from flask import Flask, request, jsonify
import pandas as pd
import math
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import ast
import os
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
import os
import re
load_dotenv()


# Retrieve the OpenAI API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes



# Load CSV file
songs_df = pd.read_csv('tracks_features.csv')


# Define tempo ranges for zones
ZONE_BOUNDS = {
   1: (60, 100),  # Slower songs
   2: (100, 130), # Moderate pace
   3: (130, 180)  # Faster songs
}


load_dotenv()  # This loads variables from .env into the environment


SPOTIPY_CLIENT_ID = os.environ.get('SPOTIPY_CLIENT_ID')
SPOTIPY_CLIENT_SECRET = os.environ.get('SPOTIPY_CLIENT_SECRET')
SPOTIPY_REDIRECT_URI = os.environ.get('SPOTIPY_REDIRECT_URI')
SCOPE = 'playlist-modify-public'


# Initialize Spotipy client
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
   scope=SCOPE,
   client_id=SPOTIPY_CLIENT_ID,
   client_secret=SPOTIPY_CLIENT_SECRET,
   redirect_uri=SPOTIPY_REDIRECT_URI
))


@app.route('/create_playlist', methods=['POST'])
def create_playlist():
    """
    Creates a playlist in the user's Spotify account and adds tracks to it.
    Expects:
    - `access_token` (str): User's Spotify API token.
    - `playlist_name` (str): Name of the playlist.
    - `track_uris` (list): List of Spotify track URIs to add.
    """
    # print('hihihihhiih')
    data = request.json
    access_token = data.get("access_token")
    playlist_name = data.get("playlist_name")
    track_uris = data.get("track_uris", [])

    if not access_token or not playlist_name or not track_uris:
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        # Initialize a Spotify client with the user’s access token
        sp_user = spotipy.Spotify(auth=access_token)

        # Get the user's Spotify ID
        user_data = sp_user.current_user()
        user_id = user_data.get("id")

        # Create a new playlist
        playlist = sp_user.user_playlist_create(user=user_id, name=playlist_name, public=True)

        # Get the playlist ID
        playlist_id = playlist.get("id")

        if not playlist_id:
            return jsonify({"error": "Failed to create playlist"}), 500

        # Add tracks to the playlist
        sp_user.playlist_add_items(playlist_id, track_uris)

        return jsonify({"message": "Playlist created successfully", "playlist_id": playlist_id, "playlist_url": playlist.get("external_urls", {}).get("spotify", "")})

    except Exception as e:
        return jsonify({"error": str(e)}), 500





def search_track(track_title, track_artist):
   """
   Search for a track on Spotify by title and artist.
   Returns the Spotify track ID if found, else None.
   """
   query = f"track:{track_title} artist:{track_artist}"
   results = sp.search(q=query, type='track', limit=1)
   tracks = results.get('tracks', {}).get('items', [])
   if tracks:
       return tracks[0]['id']
   return None


@app.route('/get_songs', methods=['GET'])
def get_songs():
   """
   Endpoint to get songs that fit the tempo range for a given zone.
   Expected query parameters:
     - zone: an integer representing the desired cardio zone
     - run_length: (optional) desired total run time in minutes, for further logic
   """
   # Extract query parameters
   zone = request.args.get('zone', type=int)
   duration = request.args.get('duration', type=int)
  
   if zone is None:
       return jsonify({'error': 'The "zone" parameter is required.'}), 400
  
   if zone not in ZONE_BOUNDS:
       return jsonify({'error': f'Invalid zone provided. Please choose one of {list(ZONE_BOUNDS.keys())}.'}), 400


   # Get the tempo range for the zone
   min_tempo, max_tempo = ZONE_BOUNDS[zone]


   # Filter the songs dataframe based on the tempo range
   filtered_df = songs_df[(songs_df['tempo'] >= min_tempo) & (songs_df['tempo'] <= max_tempo)]


   average_duration = 3.5  # Estimated average duration of a song in minutes
   num_songs = math.ceil(duration / average_duration)


   filtered_df = filtered_df.sample(n=num_songs, random_state=42)  # random_state for reproducibility


   track_ids = []
   missing_songs = []


   # For each song, find its Spotify track ID.
   for idx, row in filtered_df.iterrows():
       # Use the "name" column for the track title
       track_title = row['name']
       # Convert the string representation of artists to an actual list
       try:
           artist_list = ast.literal_eval(row['artists'])
       except (ValueError, SyntaxError):
           artist_list = [row['artists']]
      
       # Use the first artist in the list for the search
       track_artist = artist_list[0] if artist_list else ""
      
       spotify_id = search_track(track_title, track_artist)
       if spotify_id:
           track_ids.append(spotify_id)
       else:
           missing_songs.append({'title': track_title, 'artist': track_artist})
  
   # Instead of creating an actual Spotify playlist, we create a virtual playlist object.
   # Optionally, convert each track ID to a Spotify URI: "spotify:track:{track_id}"
   track_uris = [f"spotify:track:{tid}" for tid in track_ids]
  
   virtual_playlist = {
       'name': f"Syncopace Zone {zone} Playlist",
       'tracks': track_uris,  # or simply 'track_ids': track_ids if preferred
       'num_tracks': len(track_ids)
   }
  
   response = {
       'virtual_playlist': virtual_playlist,
       'songs': filtered_df.to_dict(orient='records'),
       'missing_songs': missing_songs  # Songs that weren't found on Spotify
   }
   return jsonify(response)


   # Convert the filtered DataFrame to a list of dictionaries
   # songs_list = filtered_df.to_dict(orient='records')
  
   # return jsonify({'songs': songs_list})



@app.route('/generate_ai_playlist', methods=['POST'])
def generate_ai_playlist():
    data = request.get_json()
    query = data.get('query')
    access_token = data.get("access_token")
    # print(access_token)

    if not access_token or not query:
        return jsonify({"error": "Missing access_token or query"}), 400

    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "developer", "content": "You are a music generator. Only give me a list of songs back and nothing else. Format using 1, 2, 3. etc."},
            {
                "role": "user",
                "content": f"Generate 20 songs given this: {query}"
            }
        ]
    )

    response_text = str(completion.choices[0].message.content)

    # Use regex to extract song names
    songs = re.findall(r'\d+\.\s(.+)', response_text)
    cleaned_songs = [song.rstrip() for song in songs]
    print(cleaned_songs)
    song_uris = []

    # Authenticate user with their access token
    try:
        sp_user = spotipy.Spotify(auth=access_token)

        # Get the user's Spotify ID
        user_id = sp_user.current_user()["id"]

        # Create a new playlist
        playlist = sp_user.user_playlist_create(user=user_id, name=f"{query} Playlist", public=True)
        playlist_id = playlist["id"]
        playlist_url = playlist["external_urls"]["spotify"]

    except Exception as e:
        return jsonify({"error": "Failed to authenticate or create playlist", "details": str(e)}), 500

    songs_added = []
    songs_missing = []
    # Search and add songs to playlist
    for song in cleaned_songs:
        result = sp_user.search(q=song, type="track", limit=1)
        tracks = result.get("tracks", {}).get("items", [])
        if tracks:
            track_uri = tracks[0]["uri"]
            song_uris.append(track_uri)
            songs_added.append(song)
            # print(f"✅ Found: {song} → {track_uri}")
        else:
            songs_missing.append(song)
            # print(f"❌ Not Found: {song}")

    added_songs = [{"name": song} for song in songs_added]
    missing_songs = [{"name": song} for song in songs_missing]

    if song_uris:
        try:
            sp_user.playlist_add_items(playlist_id, song_uris)
            # print("🎵 Songs added successfully!")
        except Exception as e:
            return jsonify({"error": "Failed to add songs to playlist", "details": str(e)}), 500

    # Return JSON response with playlist details
    return jsonify({
        "message": "Playlist created successfully!",
        "playlist_id": playlist_id,
        "playlist_url": playlist_url,
        "added_songs": added_songs,
        "missing_songs": missing_songs
    })





if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 
#    app.run(host='0.0.0.0', port=5000, debug=True)
#    app.run(debug=True)