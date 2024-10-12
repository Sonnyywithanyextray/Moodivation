import React, { useState, useEffect, CSSProperties } from 'react';
import { Smile, Meh, Frown, Leaf, ChevronDown } from 'lucide-react';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, query, orderBy, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: User;
  onLogout: () => Promise<void>;
}

interface MoodEntry {
  mood: number;
  timestamp: Timestamp;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [mood, setMood] = useState(50);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isSliding, setIsSliding] = useState(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const moodsRef = collection(db, 'moods', user.uid, 'entries');
        const q = query(moodsRef, orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const moodData = querySnapshot.docs.map(doc => ({
          mood: doc.data().mood,
          timestamp: doc.data().timestamp as Timestamp
        }));
        setMoodHistory(moodData);
        if (moodData.length > 0) {
          setMood(moodData[0].mood);
        }
      } catch (error) {
        console.error("Error fetching mood data:", error);
        setPopupMessage("Failed to fetch mood data. Please try again later.");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      }
    };
    fetchMoodData();
  }, [user.uid, db]);

  const moodColor = mood > 66 ? '#22c55e' : mood > 33 ? '#eab308' : '#ef4444';

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
  };

  const handleMoodChange = (newMood: number) => {
    setMood(newMood);
    setIsSliding(true);
  };

  const handleMoodChangeEnd = async () => {
    setIsSliding(false);
    try {
      const moodsRef = collection(db, 'moods', user.uid, 'entries');
      await addDoc(moodsRef, { 
        mood: mood, 
        timestamp: serverTimestamp()
      });
      console.log("Mood data sent to Firebase successfully");
      setPopupMessage("Mood recorded!");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      
      // Update mood history
      setMoodHistory(prevHistory => [{
        mood: mood,
        timestamp: Timestamp.now()
      }, ...prevHistory]);
    } catch (error) {
      console.error("Error sending mood data to Firebase:", error);
      setPopupMessage("Failed to record mood. Please try again.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  const calculateAverages = () => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const dailyMoods = moodHistory.filter(entry => entry.timestamp.toDate() >= new Date(now.getTime() - oneDay));
    const weeklyMoods = moodHistory.filter(entry => entry.timestamp.toDate() >= new Date(now.getTime() - oneWeek));
    const monthlyMoods = moodHistory.filter(entry => entry.timestamp.toDate() >= new Date(now.getTime() - oneMonth));

    const dailyAvg = dailyMoods.reduce((sum, entry) => sum + entry.mood, 0) / dailyMoods.length || 0;
    const weeklyAvg = weeklyMoods.reduce((sum, entry) => sum + entry.mood, 0) / weeklyMoods.length || 0;
    const monthlyAvg = monthlyMoods.reduce((sum, entry) => sum + entry.mood, 0) / monthlyMoods.length || 0;

    return { dailyAvg, weeklyAvg, monthlyAvg };
  };

  const averages = calculateAverages();

  const graphData = moodHistory.slice(0, 30).map(entry => ({
    date: entry.timestamp.toDate().toLocaleDateString(),
    mood: entry.mood
  })).reverse();

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
    userInfo: {
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '9999px',
      marginRight: '0.75rem',
    },
    welcomeText: {
      fontSize: windowWidth < 768 ? '1rem' : '1.25rem',
      fontWeight: '600',
    },
    userEmail: {
      fontSize: '0.875rem',
      color: '#9ca3af',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
    },
    notificationBadge: {
      backgroundColor: '#22c55e',
      color: 'black',
      borderRadius: '9999px',
      width: '2rem',
      height: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      position: 'relative',
    },
    notificationDot: {
      position: 'absolute',
      top: '-0.25rem',
      right: '-0.25rem',
      width: '0.75rem',
      height: '0.75rem',
      backgroundColor: 'white',
      borderRadius: '9999px',
      border: '2px solid black',
    },
    logoutButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      marginLeft: '0.5rem',
    },
    moodTracker: {
      backgroundColor: '#bbf7d0',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
    },
    moodQuestion: {
      color: 'black',
      marginBottom: '0.5rem',
      fontWeight: '500',
    },
    moodIcons: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem',
    },
    moodSlider: {
      width: '100%',
      accentColor: moodColor,
    },
    quoteCard: {
      backgroundColor: '#d8b4fe',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
    },
    quoteContent: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '0.75rem',
    },
    quote: {
      color: 'black',
      fontWeight: '500',
      fontSize: '0.875rem',
      marginLeft: '0.5rem',
    },
    moodOverview: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.5rem',
      color: 'black',
      fontSize: '0.75rem',
    },
    moodOverviewItem: {
      fontWeight: 'bold',
    },
    graphCard: {
      backgroundColor: '#f0f0f0',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
    },
    graphTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: 'black',
    },
    averages: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      color: 'black',
    },
    graph: {
      height: '200px',
    },
    activitiesHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    activitiesTitle: {
      fontSize: windowWidth < 768 ? '1rem' : '1.125rem',
      fontWeight: 'bold',
    },
    todayButton: {
      backgroundColor: '#22c55e',
      color: 'black',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      cursor: 'pointer',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.userInfo}>
            <img src="/api/placeholder/40/40" alt="User" style={styles.avatar} />
            <div>
              <h1 style={styles.welcomeText}>Welcome back!</h1>
              <p style={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.notificationBadge}>
              4
              <div style={styles.notificationDot}></div>
            </div>
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.moodTracker}>
          <p style={styles.moodQuestion}>How are you feeling today?</p>
          <div style={styles.moodIcons}>
            <Frown color={mood <= 33 ? '#ef4444' : '#9ca3af'} size={24} />
            <Meh color={mood > 33 && mood <= 66 ? '#eab308' : '#9ca3af'} size={24} />
            <Smile color={mood > 66 ? '#22c55e' : '#9ca3af'} size={24} />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={mood}
            onChange={(e) => handleMoodChange(parseInt(e.target.value))}
            onMouseUp={handleMoodChangeEnd}
            onTouchEnd={handleMoodChangeEnd}
            style={styles.moodSlider}
          />
        </div>

        <div style={styles.quoteCard}>
          <div style={styles.quoteContent}>
            <Leaf color="#22c55e" size={20} />
            <p style={styles.quote}>"Your potential is endless. Keep pushing forward!"</p>
          </div>
          <div style={styles.moodOverview}>
            <div>
              <p style={styles.moodOverviewItem}>Mood overview</p>
              <p>Positive</p>
            </div>
            <div>
              <p style={styles.moodOverviewItem}>Gratitude journal</p>
              <p>Mindfulness</p>
            </div>
            <div>
              <p style={styles.moodOverviewItem}>Stress level</p>
              <p>Calmness</p>
            </div>
          </div>
        </div>

        <div style={styles.graphCard}>
          <h2 style={styles.graphTitle}>Mood History</h2>
          <div style={styles.averages}>
            <p>Daily Average: {averages.dailyAvg.toFixed(2)}</p>
            <p>Weekly Average: {averages.weeklyAvg.toFixed(2)}</p>
            <p>Monthly Average: {averages.monthlyAvg.toFixed(2)}</p>
          </div>
          <div style={styles.graph}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.activitiesHeader}>
          <h2 style={styles.activitiesTitle}>Your activities for</h2>
          <button style={styles.todayButton}>
            Today
            <ChevronDown size={16} style={{ marginLeft: '0.25rem' }} />
          </button>
        </div>
      </div>
      {showPopup && <div style={styles.popup}>{popupMessage}</div>}
    </div>
  );
};

export default Dashboard;