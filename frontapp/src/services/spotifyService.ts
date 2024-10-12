
export const getCurrentPlayingTrack = async (accessToken: string) => {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  
    if (response.status === 200) {
      return response.json(); // Return track data
    } else if (response.status === 204) {
      console.log("No track is currently playing.");
      return null;
    } else {
      console.error("Failed to fetch the current track.");
    }
  
};
