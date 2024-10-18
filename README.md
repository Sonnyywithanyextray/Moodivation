# MoodMarathon
HackHarvard official project

# Link to Hi-Fi Prototype:
https://app.uizard.io/p/a5f82c46


MoodMarathon is an ephimeral web application that gamifies mental health maintenance by encouraging users to log in daily and complete various mental health challenges, such as deep breathing or journaling. Users must complete these challenges within a 24-hour window to maintain their streak. Failing to perform the daily challenge within this timeframe results in the loss of their streak.

## **Table of Contents**
- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## **Introduction**
The app aims to detect users' moods and deliver personalized content such as quotes, videos, and music to elevate their mood. The core idea behind Moodivation is to leverage technology to create a positive impact on users' mental well-being by providing timely motivation in a personalized manner.

## **Features**
- **Mood Detection**: Users can input their current mood, and the app will recommend motivational content accordingly.
- **Personalized Content**: Based on users' input, Moodivation suggests tailored content like quotes, music playlists, or videos that match their emotional state.
- **Daily Motivation Feed**: Users can browse a daily feed filled with inspiration.
- **Journal**:RAG model integration for determinig mood based on Journals

## **Tech Stack**
- **Frontend**: React JS (for building the web app)
- **AI**: Sentiment Analysis model built with MATLAB
- **Backend**: Node.js, Express
- **Database**: Firebase (storing user data, moods, and content)
- **APIs**: 
    - YouTube API (for delivering motivational videos)
    - Spotify API (for music recommendations)

## **Installation**
### Prerequisites
Ensure you have the following installed:
- Node.js (v14.x or higher)

### Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/username/moodivation.git
    cd moodivation
    ```

2. Install dependencies:
    ```bash
    npm install
    cd client
    npm install
    ```


3. Run the backend:
    ```bash
    npm start
    ```

4. Run the React Js app (client side):
    ```bash
    cd client
    npm start
    ```

5. Access the app in a mobile emulator or scan the Expo QR code on your mobile device to run the app.

## **Usage**
1. **Mood Input**: Upon opening the app, users are prompted to input their current mood (e.g., happy, sad, neutral).
2. **Personalized Recommendations**: Based on the mood input, the app suggests quotes, playlists, and videos that resonate with the user's emotional state.
3. **Daily Feed**: Users can explore a daily updated feed of motivational content.
4. **Graph**: This tracks average mood progress using a graph which gives the average mood weekily, monthly and yearly 

## **Contributing**
Contributions are welcome! To get started, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature-name
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add new feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Submit a pull request with a detailed explanation of your changes.

### Contribution Guidelines:
- Make sure to test your code thoroughly.
- Follow proper coding standards and comment your code appropriately.
- Ensure the app functions smoothly without any breaking changes.

## **License**
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## **Acknowledgments**
- **Inspiration**: The project was inspired by a desire to combine mental health and technology to create a positive, motivating experience.
- **API Providers**: Special thanks to YouTube, and Spotify for their APIs that make content recommendations possible.


## Developers
Etelson Sonny Alcius (https://github.com/Sonnyywithanyextray)

Mercy Eze (https://github.com/Mercy-Eze/)

Joseph Oduyebo (https://github.com/jayco12/)
