import { getAccessToken } from '../utils/helper';

const API_BASE_URL = 'https://api.spotify.com/v1';

// Define the user profile type
interface UserProfile {
  display_name: string;
  images: { url: string }[];
  activitiesCount: number;
}

// Define the playlist type
interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return {
    ...data,
    activitiesCount: 5, // Example static data, change as needed
  };
};

export const getMoodPlaylists = async (): Promise<Playlist[]> => {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/browse/categories/mood/playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.playlists.items;
};
