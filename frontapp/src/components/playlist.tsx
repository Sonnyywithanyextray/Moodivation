import React, { useEffect, useState } from 'react';
import { getMoodPlaylists } from '../services/spotifyService';

// Define the type for a playlist
interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

const PlaylistSection: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const data = await getMoodPlaylists();
      setPlaylists(data);
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="playlist-section">
      <h2>Mood Playlists</h2>
      <div className="playlist-grid">
        {playlists.map(playlist => (
          <div key={playlist.id} className="playlist-item">
            <img src={playlist.images[0]?.url} alt={playlist.name} />
            <h3>{playlist.name}</h3>
            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              Listen on Spotify
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSection;
