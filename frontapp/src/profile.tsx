import React, {  CSSProperties,useState } from "react";
import { User } from "firebase/auth";

interface ProfileProps {
  user: User;
  onLogout: () => Promise<void>;
}
const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
    // const [meditationGoal, setMeditationGoal] = useState(10);
    // const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setMeditationGoal(parseInt(e.target.value));
    // };
    const styles: { [key: string]: CSSProperties } = {
        container: {
            minHeight: '100vh', 
            padding: '16px', 
        },
        header: {
            backgroundColor: '#10b981', // Tailwind equivalent: bg-green-500
            padding: '16px', // Tailwind equivalent: p-4
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center', 
            borderRadius: '8px',
            color: 'white', 
            fontSize: '18px', 
        },
        navLink: {
            color: 'white', 
            marginRight: '16px', 
            textDecoration: 'none',
        },
        card: {
            backgroundColor: 'white', 
            borderRadius: '8px',
            padding: '16px', 
            marginTop: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Tailwind equivalent: shadow-md
        },
        profileImage: {
            width: '64px',
            height: '64px', 
            borderRadius: '50%',
            marginRight: '12px', 
        },
        sectionTitle: {
            fontSize: '18px', 
            fontWeight: 'bold',
            marginBottom: '8px',
            
        },
        progressContainer: {
            display: 'flex', 
            marginTop: '8px', 
        },
        halfWidth: {
            width: '50%', 
        },
        inputRange: {
            width: '100%', 
            marginTop: '8px',
        },
        toggleContainer: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '16px',
        },
        toggleLabel: {
            marginRight: '8px',
        },
        toggleSwitch: {
            marginLeft: '8px',
        },
        resourcesContainer: {
            backgroundColor: '#d1fae5',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '16px'
        },
        };

    return (
        <div style={styles.container}>
          <header style={styles.header}>
            <h1>Moodtivation</h1>
            <nav>
              <a href="/" style={styles.navLink}>Home</a>
              <a href="/" style={styles.navLink}>Activities</a>
              <a href="/" style={{ ...styles.navLink, fontWeight: 'bold' }}>Profile</a>
            </nav>
          </header>
    
          <div style={styles.card}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/frontapp/src/assets/Icons/12.png" alt="Jessica Parker" style={styles.profileImage} />
              <div>
                <h2 style={styles.sectionTitle}>Jessica Parker</h2>
                <p>Engaged in 5 activities this week</p>
              </div>
            </div>
          </div>
    
          <div style={{ ...styles.card, backgroundColor: '#e9d5ff' /* Tailwind equivalent: bg-purple-100 */ }}>
            <h3 style={styles.sectionTitle}>Set Your Goals</h3>
            <label>Daily Meditation (minutes)</label>
            <input type="range" min="1" max="60" style={styles.inputRange} />
    
            <div style={styles.toggleContainer}>
              <span style={styles.toggleLabel}>Receive Notifications</span>
              <input type="checkbox" style={styles.toggleSwitch} />
            </div>
          </div>
    
          <div style={{ ...styles.card, backgroundColor: '#bfdbfe' /* Tailwind equivalent: bg-blue-100 */ }}>
            <h3 style={styles.sectionTitle}>Your Progress</h3>
            <div style={styles.progressContainer}>
              <div style={styles.halfWidth}>
                <img src="/path-to-piechart.jpg" alt="Progress Pie Chart" />
              </div>
              <div style={styles.halfWidth}>
                <img src="/path-to-barchart.jpg" alt="Progress Bar Chart" />
              </div>
            </div>
          </div>
    
          <div style={styles.resourcesContainer}>
            <h3 style={styles.sectionTitle}>Resources & Tools</h3>
            <ul>
              <li>Meditation Techniques</li>
            </ul>
          </div>
        </div>
      );
    };

export default Profile;
