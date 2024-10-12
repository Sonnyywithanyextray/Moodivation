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

interface ProfileProps {
  user: User;
}
interface MoodEntry {
  mood: number;
  timestamp: Timestamp;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
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

  const graphData = moodHistory
    .slice(0, 30)
    .map((entry) => ({
      date: entry.timestamp.toDate().toLocaleDateString(),
      mood: entry.mood,
    }))
    .reverse();

  const moodColor = mood > 66 ? '#22c55e' : mood > 33 ? '#eab308' : '#ef4444';
  const getColor = (index: number) => moodColor;

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
      backgroundColor: "#10b981",
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
        backgroundColor: "#d1fae5",
        padding: "16px",
        borderRadius: "8px",
        marginTop: "16px",
        color:"black"
      },
  };

  return (
    <div style={styles.container}>
    <div style={styles.content}>
      <header style={styles.header}>
      <img src="frontapp/src/assets/Icons/6.png" alt=""
          />
        <h1 style={styles.h1}>Moodtivation</h1>
        <nav>
          <a href="/" style={styles.navLink}>
            Home
          </a>
          <a href="/" style={styles.navLink}>
            Activities
          </a>
          <a style={{ ...styles.navLink, fontWeight: "bold" }}>Profile</a>
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
          backgroundColor: "#e9d5ff" ,
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
                  outerRadius={80}
                  fill="#8884d8"
                  label
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
      </div>
    </div>
  );
};

export default Profile;
