import React, { CSSProperties, useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import Spotify from "../components/playlist";
import { motion } from 'framer-motion';
import {
  Smile,
  Meh,
  Frown,
  Leaf,
  User as UserIcon,
  Music,
  Settings,
  LogOut,
} from 'lucide-react';
import { getProfilePicUrl } from '../utils/profilePicUtils';

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

const MOOD_CATEGORIES = [
  { name: 'Negative', range: [0, 50], color: '#ef4444' },
  { name: 'Neutral', range: [51, 80], color: '#eab308' },
  { name: 'Positive', range: [81, 100], color: '#22c55e' },
];

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [mood, setMood] = useState(50);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [aggregatedMoods, setAggregatedMoods] = useState<{ name: string; value: number }[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [profilePicUrl, setProfilePicUrl] = useState<string>('/api/placeholder/40/40');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<SpotifyCurrentlyPlaying | null>(null);
  const [completedActivities, setCompletedActivities] = useState<number>(0);
  const db = getFirestore();
  const { login } = useSpotifyAuth();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotify_access_token")
  );
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showActivityConfirmation, setShowActivityConfirmation] = useState<boolean>(false);

  const pageVariants = {
    initial: { opacity: 0, x: '100%' },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: '-100%' }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          const newProfilePicUrl = getProfilePicUrl(moodData[0].mood);
          setProfilePicUrl(newProfilePicUrl);
        }

        const categoryCounts = MOOD_CATEGORIES.map(category => {
          const count = moodData.filter(entry => 
            entry.mood >= category.range[0] && entry.mood <= category.range[1]
          ).length;
          return { name: category.name, value: count };
        });
        setAggregatedMoods(categoryCounts);
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    };
    fetchMoodData();
  }, [user.uid, db]);

  useEffect(() => {
    const fetchCompletedActivities = async () => {
      try {
        const activitiesRef = collection(db, 'activities', user.uid, 'completed');
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const q = query(activitiesRef, where('timestamp', '>=', oneWeekAgo));
        const querySnapshot = await getDocs(q);
        setCompletedActivities(querySnapshot.size);
      } catch (error) {
        console.error('Error fetching completed activities:', error);
      }
    };

    fetchCompletedActivities();
  }, [user.uid, db]);

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
      setCurrentlyPlaying(null);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchCurrentlyPlaying();
    }
  }, [accessToken]);

  const getColor = (categoryName: string) => {
    const category = MOOD_CATEGORIES.find(cat => cat.name === categoryName);
    return category ? category.color : '#8884d8';
  };

  const handleLogout = async () => {
    await onLogout();
  };

  const handleProfileClick = () => {
    // Navigation logic if applicable
  };

  const handleConfirmActivity = async () => {
    if (selectedActivity) {
      // Assuming you have a startTimer function or similar
      // startTimer(selectedActivity.name, selectedActivity.timeInSeconds);
      setShowActivityConfirmation(false);

      try {
        const activitiesRef = collection(db, 'activities', user.uid, 'completed');
        await addDoc(activitiesRef, {
          name: selectedActivity.name,
          timestamp: serverTimestamp(),
        });
        setCompletedActivities(prev => prev + 1);
        console.log('Activity recorded:', selectedActivity.name, 'for user:', user.uid);
      } catch (error) {
        console.error('Error recording completed activity:', error);
      }
    }
  };

  const styles: { [key: string]: CSSProperties } = {
    container: {
      backgroundColor: 'black',
      color: 'white',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    content: {
      width: '100%',
      maxWidth: '480px',
      padding: '1rem',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: windowWidth < 768 ? '1.5rem' : '1.8rem',
      fontWeight: '600',
      color: 'white',
      marginRight: '1rem',
    },
    navLink: {
      color: 'white',
      marginRight: '16px',
      textDecoration: 'none',
      fontSize: '0.875rem',
    },
    card: {
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
    },

    profileCard: {
      backgroundColor: 'rgb(216, 180, 254)',
      color: 'black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      justifyContent: 'flex-start', // Add this line
    },
    goalsCard: {
      backgroundColor: 'rgb(187, 247, 208)',
      color: 'black',
    },
    progressCard: {
      backgroundColor: 'white',
      color: 'black',
    },
    defaultCard: {
      backgroundColor: '#1e1e1e',
    },
    profileInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      marginBottom: '1rem', // Add this line
    },
    profileImage: {
      width: '10rem',
      height: '10rem',
      borderRadius: '50%',
      marginBottom: '0.5rem', // Reduce this value
      cursor: 'pointer',
    },
    profileName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.25rem', // Reduce this value
      textAlign: 'center',
    },
    profileEmail: {
      fontSize: '1rem',
      color: '#4a4a4a',
      marginBottom: '0.5rem', // Reduce this value
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    inputRange: {
      width: '100%',
      marginTop: '0.5rem',
    },
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '1rem',
    },
    toggleLabel: {
      marginRight: '0.5rem',
    },
    toggleSwitch: {
      marginLeft: '0.5rem',
    },
    graph: {
      height: '200px',
    },
    spotifyContainer: {
      marginTop: '1rem',
    },
    spotifyButton: {
      backgroundColor: '#1DB954',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
    },
    currentlyPlaying: {
      marginTop: '0.5rem',
      fontSize: '0.875rem',
    },
    albumCover: {
      width: '50px',
      height: '50px',
      marginTop: '0.5rem',
    },
    resourcesContainer: {
      marginTop: '1rem',
    },
    resourcesList: {
      listStyleType: 'none',
      padding: 0,
    },
    resourceItem: {
      marginBottom: '0.5rem',
    },
    logoutButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.25rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
    },
    activitiesText: {
      textAlign: 'center',
      fontSize: '1rem',
      marginTop: '0',
    },
    popup: {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      zIndex: 1000,
    },
    avatarOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '2.5rem',
      height: '2.5rem',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '9999px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      cursor: 'pointer',
    },
    avatarOverlayText: {
      fontSize: '0.75rem',
      fontWeight: 'bold',
    },
    confirmationPopup: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#333',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 1000,
      textAlign: 'center',
    },
    confirmationButtons: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '20px',
    },
    confirmButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    cancelButton: {
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

  return (
    <motion.div
      style={styles.container}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>Profile</h1>
            <nav>
              <a href="/" style={styles.navLink}>Home</a>
              <span style={{ ...styles.navLink, fontWeight: 'bold' }}>Profile</span>
            </nav>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <div style={{...styles.card, ...styles.profileCard}}>
    <div style={styles.profileInfo}>
      <img
        src={profilePicUrl}
        alt="Profile"
        style={styles.profileImage}
        onClick={handleProfileClick}
      />
      <h2 style={styles.profileName}>{user.displayName || 'User'}</h2>
      <p style={styles.profileEmail}>{user.email}</p>
      <p style={styles.activitiesText}>
        Engaged in {completedActivities} {completedActivities === 1 ? 'activity' : 'activities'} this week
      </p>
    </div>
  </div>   
        
        <div style={{...styles.card, ...styles.goalsCard}}>
          <h3 style={styles.sectionTitle}>Set Your Goals</h3>
          <label>Daily Meditation (minutes)</label>
          <input type="range" min="1" max="60" style={styles.inputRange} />

          <div style={styles.toggleContainer}>
            <span style={styles.toggleLabel}>Receive Notifications</span>
            <input type="checkbox" style={styles.toggleSwitch} />
          </div>
        </div>

        <div style={{...styles.card, ...styles.progressCard}}>
          <h2 style={{...styles.sectionTitle, color: 'black'}}>Your Progress</h2>
          <div style={styles.graph}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={aggregatedMoods}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {aggregatedMoods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{...styles.card, ...styles.defaultCard}}>
          <h3 style={{...styles.sectionTitle, color: 'white'}}>Resources & Tools</h3>
          <ul style={styles.resourcesList}>
            <li style={styles.resourceItem}>Meditation Techniques</li>
            <li style={styles.resourceItem}>Stress Management Guide</li>
            <li style={styles.resourceItem}>Sleep Improvement Tips</li>
          </ul>
        </div>
      </div>

      {showPopup && <div style={styles.popup}>{popupMessage}</div>}
      
      {showActivityConfirmation && (
        <div style={styles.confirmationPopup}>
          <p>Are you sure you want to start this activity?</p>
          <p>{selectedActivity?.name} - {selectedActivity?.duration}</p>
          <div style={styles.confirmationButtons}>
            <button style={styles.confirmButton} onClick={handleConfirmActivity}>
              Yes
            </button>
            <button style={styles.cancelButton} onClick={() => setShowActivityConfirmation(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Profile;