from flask import Flask, request, jsonify
import pandas as pd
import random
import requests
import os

app = Flask(__name__)

# Load CSV file
CSV_FILE_PATH = "/Users/adilahmed/Desktop/dataset.csv" 
df = pd.read_csv(CSV_FILE_PATH)

# Define tempo ranges for zones
ZONE_BOUNDS = {
    1: (60, 100),  # Slower songs
    2: (100, 130), # Moderate pace
    3: (130, 180)  # Faster songs
}

SPOTIFY_API_URL = "https://api.spotify.com/v1/tracks"
SPOTIFY_PLAYLIST_URL = "https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
SPOTIFY_CREATE_PLAYLIST_URL = "https://api.spotify.com/v1/users/{user_id}/playlists"
SPOTIFY_ACCESS_TOKEN = "your_spotify_access_token"  # Replace with valid token

@app.route('/recommend_songs', methods=['GET'])
def recommend_songs():
    zone = int(request.args.get('zone', 2))  # Default to zone 2
    user_id = request.args.get('user_id')  # User's Spotify ID
    market = request.args.get('market', 'US')
    
    if zone not in ZONE_BOUNDS:
        return jsonify({"error": "Invalid zone. Choose between 1, 2, or 3."}), 400

    tempo_min, tempo_max = ZONE_BOUNDS[zone]
    filtered_songs = df[(df['tempo'] >= tempo_min) & (df['tempo'] <= tempo_max)]

    if filtered_songs.empty:
        return jsonify({"error": "No songs found for the given zone."}), 404
    
    selected_songs = filtered_songs.sample(n=min(15, len(filtered_songs)))
    track_ids = selected_songs['track_id'].tolist()
    
    # Call Spotify API to get track details
    headers = {"Authorization": f"Bearer {SPOTIFY_ACCESS_TOKEN}"}
    track_details_response = requests.get(
        f"{SPOTIFY_API_URL}?market={market}&ids={','.join(track_ids)}",
        headers=headers
    )
    track_details = track_details_response.json()
    
    # Create a new playlist
    playlist_data = {
        "name": "Your Custom zone {zone} Playlist",
        "public": False,
        "collaborative": False,
        "description": "A playlist generated based on tempo zone selection."
    }
    create_playlist_response = requests.post(
        SPOTIFY_CREATE_PLAYLIST_URL.format(user_id=user_id),
        headers=headers,
        json=playlist_data
    )
    
    if create_playlist_response.status_code != 201:
        return jsonify({"error": "Failed to create playlist."}), 500
    
    playlist_id = create_playlist_response.json().get("id")
    
    add_to_playlist_response = requests.post(
        SPOTIFY_PLAYLIST_URL.format(playlist_id=playlist_id),
        headers=headers,
        json={"uris": [f"spotify:track:{tid}" for tid in track_ids]}
    )
    
    if add_to_playlist_response.status_code != 201:
        return jsonify({"error": "Failed to add songs to playlist."}), 500
    
    return jsonify({"playlist_id": playlist_id, "selected_tracks": track_details})

if __name__ == '__main__':
    app.run(debug=True)