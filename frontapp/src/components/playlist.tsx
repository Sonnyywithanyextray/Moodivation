import React, { useEffect, useState } from 'react';
import { getCurrentPlayingTrack } from '../services/spotifyService';

interface Track {
  name: string;
  artists: string;
  albumArt: string;
}

const Spotify = ({ accessToken }: { accessToken: string }) => {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const fetchTrack = async () => {
      const trackData = await getCurrentPlayingTrack(accessToken);
      if (trackData && trackData.item) {
        const trackName = trackData.item.name;
        const artistName = trackData.item.artists.map((artist: any) => artist.name).join(', ');
        const albumArt = trackData.item.album.images[0].url;

        setTrack({ name: trackName, artists: artistName, albumArt: albumArt });
      }
    };

    fetchTrack();
  }, [accessToken]);

  return (
    <div>
      {track ? (
        <div className="current-track">
          <img src={track.albumArt} alt="Album Art" style={{ width: '100px' }} />
          <h2>{track.name}</h2>
          <p>{track.artists}</p>
        </div>
      ) : (
        <p>No song is currently playing</p>
      )}
    </div>
  );
};

export default Spotify;
