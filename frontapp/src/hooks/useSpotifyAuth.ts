import { useEffect } from 'react';
import { setAccessToken } from '../utils/helper';

const SPOTIFY_CLIENT_ID = '3c50ea6940874b9fbbd5a278a6d369cf';
const REDIRECT_URI = 'your_redirect_uri';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';
const SCOPE = 'user-read-private playlist-read-private';

const useSpotifyAuth = () => {
  useEffect(() => {
    const hash = window.location.hash;
    let token = localStorage.getItem('spotify_access_token');

    if (!token && hash) {
      token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        ?.split('=')[1];

      if (token) {
        setAccessToken(token);
        window.location.hash = ''; // Clear the hash from the URL
      }
    }
  }, []);

  const login = (): void => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${SPOTIFY_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
  };

  return { login };
};

export default useSpotifyAuth;
