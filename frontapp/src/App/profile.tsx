import React, { CSSProperties, useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import Spotify from "../components/playlist";

interface ProfileProps {
  user: User;
  onLogout: () => Promise<void>;
}

interface MoodEntry {
  mood: number;
  timestamp: Timestamp;
}
interface SpotifyCurrentlyPlaying {
  item: {
    name: string;
    artists: { name: string }[];
    album: {
      images: { url: string }[];
    };
  };
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [mood, setMood] = useState(50);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const db = getFirestore();
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const moodsRef = collection(db, "moods", user.uid, "entries");
        const q = query(moodsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const moodData = querySnapshot.docs.map((doc) => ({
          mood: doc.data().mood,
          timestamp: doc.data().timestamp as Timestamp,
        }));
        setMoodHistory(moodData);
        if (moodData.length > 0) {
          setMood(moodData[0].mood);
        }
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    };
    fetchMoodData();
  }, [user.uid, db]);
  const { login } = useSpotifyAuth();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotify_access_token")
  );

  const graphData = moodHistory
    .slice(0, 30)
    .map((entry) => ({
      date: entry.timestamp.toDate().toLocaleDateString(),
      mood: entry.mood,
    }))
    .reverse();

  const moodColor = mood > 66 ? "#22c55e" : mood > 33 ? "#eab308" : "#ef4444";
  const getColor = (index: number) => moodColor;
  const [currentlyPlaying, setCurrentlyPlaying] =
    useState<SpotifyCurrentlyPlaying | null>(null);

  // Function to fetch currently playing track
  const fetchCurrentlyPlaying = async () => {
    if (!accessToken) return;

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      setCurrentlyPlaying(data);
    } else {
      setCurrentlyPlaying(null); // No track is currently playing or error occurred
    }
  };

  // Fetch currently playing track when the component loads or accessToken changes
  useEffect(() => {
    if (accessToken) {
      fetchCurrentlyPlaying();
    }
  }, [accessToken]);

  const styles: { [key: string]: CSSProperties } = {
    container: {
      backgroundColor: "black",
      color: "white",
      minHeight: "100vh",
      width: "100%",
      padding: "1rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    content: {
      width: "100%",
      maxWidth: "480px",
    },
    header: {
      backgroundColor: "#4caf50",
      padding: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: "8px",
      marginBottom: "1.5rem",
    },
    h1: {
      fontSize: "1.8rem",
      fontFamily: "Times New Roman",
      color: "black",
    },
    navLink: {
        color: "black",
        marginRight: "16px",
        textDecoration: "none",
      },
    card: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "16px",
      marginTop: "16px",
      color: "black",
    },
    graph: {
      width: "100%",
      height: 200,
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    progressContainer: {
      display: "flex",
      marginTop: "8px",
    },
    halfWidth: {
      width: "50%",
    },
    inputRange: {
      width: "100%",
      marginTop: "8px",
    },
    toggleContainer: {
      display: "flex",
      alignItems: "center",
      marginTop: "16px",
    },
    toggleLabel: {
      marginRight: "8px",
    },
    toggleSwitch: {
      marginLeft: "8px",
    },
    resourcesContainer: {
      backgroundColor: "#E8F5E9",
      padding: "16px",
      borderRadius: "8px",
      marginTop: "16px",
      color: "black"
    },
    logoutButton: {
      backgroundColor: "#ef4444",
      color: "white",
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      marginTop: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <header style={styles.header}>
          <img src="frontapp/src/assets/Icons/6.png" alt="" />
          <h1 style={styles.h1}>Moodtivation</h1>
          <nav>
            <a href="/" style={styles.navLink}>
              Home
            </a>
            <a href="/" style={styles.navLink}>
              Activities
            </a>
            <a style={{ ...styles.navLink, fontWeight: "bold" }}>Profile</a>
            {accessToken ? (
            <Spotify accessToken={accessToken} /> // Render Spotify component
          ) : (
            <button onClick={login} className="spotify-login-button">
              Connect to Spotify
            </button>
          )}

            {currentlyPlaying ? (
              <>
                <p>
                  {currentlyPlaying.item.name} by{" "}
                  {currentlyPlaying.item.artists
                    .map((artist) => artist.name)
                    .join(", ")}
                </p>
                <img
                  src={currentlyPlaying.item.album.images[0].url}
                  alt="Album cover"
                  width={150}
                />
              </>
            ) : (
              <p>No song is currently playing.</p>
            )}
          </nav>
        </header>

        <div style={styles.card}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/frontapp/src/assets/Icons/12.png"
              alt="Jessica Parker"
              style={styles.profileImage}
            />
            <div>
              <h2 style={styles.sectionTitle}>Jessica Parker</h2>
              <p>Engaged in 5 activities this week</p>
            </div>
          </div>
        </div>

        <div
          style={{
            ...styles.card,
            backgroundColor: "#C7C7F1",
          }}
        >
          <h3 style={styles.sectionTitle}>Set Your Goals</h3>
          <label>Daily Meditation (minutes)</label>
          <input type="range" min="1" max="60" style={styles.inputRange} />

          <div style={styles.toggleContainer}>
            <span style={styles.toggleLabel}>Receive Notifications</span>
            <input type="checkbox" style={styles.toggleSwitch} />
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Your Progress</h2>
          <div style={styles.graph}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={graphData}
                  dataKey="mood"
                  nameKey="date"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  labelLine={false}
                  label={({ name, percent }) =>
                    name === "Mood" ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                  //  label
                >
                  {graphData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(index)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.resourcesContainer}>
          <h3 style={styles.sectionTitle}>Resources & Tools</h3>
          <ul>
            <li>Meditation Techniques</li>
          </ul>
        </div>

        <button style={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;