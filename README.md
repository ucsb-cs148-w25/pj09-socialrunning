# Project 9: Social Running App

### This is a running app that creates custom music playlists, using your ideal cardio zone, genre of music, mood (e.g., "gloomy day jog")  and desired running length to suggest songs that keep you motivated throughout your run! Users can share these playlists via Spotify and save them for future use. 

## Instructions for setup:
## Backend Setup (Python)

1. **Create a Virtual Environment, install dependencies, and start running backend**  
   Run the following command to create a virtual environment named `venv` inside the **backend** folder within syncopace:
   ```bash
   - python3 -m venv venv
   - source venv/bin/activate
   - pip install -r requirements.txt
   - python3 app.py

   Download from this kaggle dataset to your local computer: https://www.kaggle.com/datasets/priyamchoksi/spotify-dataset-114k-songs 
   In the backend folder add take this downloaded file and and change the name to "tracks_features.csv"

## Frontend Setup (Javacript) 
- instantiate a new terminal
- cd into syncopace
- npm install
- run "npx expo start --tunnel" or just "npx expo start"

## IP Address Setup 
- Go to the config.js file located in the syncopace folder
- For the SERVER_IP field, enter the IP address that your device is on
- For the SERVER_PORT field, the app should run on port 5001, but if not, enter an available port on your device

## .env file
- Ask for the .env file and place inside the syncopace folder

## Tech Stack
- **Frontend**: React Native (mobile app)
- **Backend**: Firebase (Firestore, Functions, and Authentication)
- **Music Integration**: Spotify API (OAuth and Playback APIs)
- **Hosting**: Firebase Hosting for backend and related services

| Member        | GitHub id    |
| :-----------: | :----------: |
| Ron Kibel | rkibel |
| Liv Jonokuchi | livjono |
| Adil Ahmed | adilahmed2 |
| Nilay Kundu | nilay-kundu |
| Ria Sinha | riasinha |
| Piyush Jadhav | PiyushJadhav |
| Aneesh Agarwal | aneeshtheplug|

## MVP Features

### **1. Authentication**
- **Features:**
  - User signup/login using Firebase Authentication.
  - Option to link Spotify account using OAuth via the Spotify API for song access.
- **UI:**
  - Clean, minimal welcome/login screen with options to connect Spotify.

---

### **2. Main Setup Screen (Workout Preferences)**
- **Features:**
  - Allow the user to select:
    - **Cardio Zone** 
    - **Duration**
- **UI:**
  - Simple form or dropdowns/sliders with predefined options for zones, genres, and durations.

---

### **3. Song Selection**
- **Features:**
  - Fetch songs using the Spotify API based on:
    - **Cardio Zone:** Match BPM ranges for each zone (e.g., Zone 3 = 120-140 BPM).
    - **Duration:** Select songs to fit within the chosen timeframe.
---

### **4. Playlist Display and Playback**
- **Features:**
  - Display the generated playlist with:
    - Song titles, artist names, album artwork, and durations.
    - Total runtime.

---
## Nice-to-Have Features (Post-MVP)

### **1. Timer/Progress Tracker**
- **Features:**
  - Basic countdown or elapsed time tracker matching the selected workout duration.
  - Visual indication of time left in the workout session.
  - Option to skip songs while running.

---

### **2. Simple History/Logs**
- **Features:**
  - Track past runs, showing:
    - Date of the run.
    - Selected cardio zone, genre, and duration.
    - Playlist used during the session.
  - Store user data in Firebase Firestore for scalability.
- **UI:**
  - A basic history screen displaying a list of past sessions.

---

### **3. More Stretch Features**
1. **Dynamic Song Adaptation**:
   - Real-time adjustment of song BPM based on running speed or heart rate (via wearable device integration).
   
2. **Wearable Integration**:
   - Sync with fitness trackers like Garmin, Fitbit, or Apple Watch to automatically detect and adjust cardio zones.

3. **Offline Mode**:
   - Allow users to pre-download songs and playlists for runs without an internet connection.
   - Let users to manually rearrange the auto-generated playlist before starting their run.

4. **Social Features**:
   - Enable sharing of playlists or running sessions with friends.
   - Introduce leaderboards for metrics like workout consistency or total miles run
   - Display total run time, songs played, and estimated calories burned which can be shared on social media

5. **Custom Zone Settings**:
   - Allow users to define their own BPM ranges for cardio zones, providing more flexibility and personalization.


## User Roles and Permissions

### 1. **Runner**
- **Role Description**: The primary user of the app. Runners use the app to create and play playlists tailored to their workout preferences.
- **Capabilities**:
  - Sign up and log in using Firebase Authentication.
  - Link their Spotify account to access personalized music recommendations.
  - Select workout preferences (cardio zone, genre, and duration).
  - Generate playlists that sync song tempo with their running pace.
  - Start, pause, and skip songs using Spotify playback controls.
  - View and track their playlist details, including total runtime and song information.
- **Goals**:
  - Enhance their workout experience with music that keeps them motivated and on pace.
  - Simplify the process of finding music that matches their fitness goals.

---

### 2. **Admin**
- **Role Description**: Responsible for monitoring and maintaining app functionality and user-generated data.
- **Capabilities**:
  - Manage user accounts, including resetting access or addressing account issues.
  - Moderate app-generated content, such as playlists, to ensure compliance with app standards (e.g., no inappropriate content).
  - Oversee Spotify API integrations and debug any backend functionality.
- **Goals**:
  - Ensure a seamless and safe experience for runners.
  - Handle any issues related to user authentication, Spotify integration, or backend processes.

---

### Roles and Permissions Summary

| Role    | Permissions                                                                                 |
|---------|---------------------------------------------------------------------------------------------|
| Runner  | Create and customize playlists, sync music with pace, control playback, and track progress. |
| Admin   | Moderate content, manage user accounts, debug API integrations, and oversee app operations. |


By clearly defining roles, we aim to provide a seamless and focused experience for runners while ensuring app quality and security through admin oversight.





