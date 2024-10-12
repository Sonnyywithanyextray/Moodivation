// src/hooks/useSpotifyAuth.ts
import { useEffect } from 'react';

const SPOTIFY_CLIENT_ID = '3c50ea6940874b9fbbd5a278a6d369cf';
const REDIRECT_URI = 'http://localhost:5173/callback'; // Ensure this matches your app
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPE = 'user-read-currently-playing user-read-playback-state';

export const setAccessToken = (token: string) => {
  localStorage.setItem('spotify_access_token', token);
};

const useSpotifyAuth = () => {
  useEffect(() => {
    const hash = window.location.hash; // Extracts the hash from the URL
    let token = localStorage.getItem('spotify_access_token'); // Check if we already have the token

    if (!token && hash) {
      // Find access_token in the hash fragment
      token = hash
        .substring(1) // Remove the '#' symbol
        .split('&') // Split by '&' to get each key-value pair
        .find((elem) => elem.startsWith('access_token')) // Find the 'access_token' part
        ?.split('=')[1]; // Extract the actual token value

      if (token) {
        setAccessToken(token); // Store token in localStorage
        window.location.hash = ''; // Clear hash from URL for cleaner look
      }
    }
  }, []);

  const login = (): void => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
    window.location.href = authUrl;
  };

  return { login };
};

export default useSpotifyAuth;
