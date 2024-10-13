import React, { CSSProperties } from 'react';
import {
  BookOpen,
  Headphones,
  Airplay,
  PenTool,
  Book,
  Music
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
const ChoiceActivities: React.FC = () => {

  const activities = [
    { icon: <BookOpen size={32} />, name: 'Read stories', component: "/journal" },
    { icon: <Headphones size={32} />, name: 'Listen to music', component: "" },
    { icon: <Airplay size={32} />, name: 'Breather', component:""},
    { icon: <PenTool size={32} />, name: 'Draw', component: "" },
    { icon: <Book size={32} />, name: 'Journal', component: "" },
    { icon: <Music size={32} />, name: 'Dance', component: "" }
  ];
  const navigate = useNavigate();

  const styles: { [key: string]: CSSProperties } = {
    header: {
      color: '#FFF',
      textAlign: 'left',
      fontSize: '1.25rem',
      fontWeight: '600',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    activityList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      backgroundColor: '#1e1e1e',
      padding: '1rem',
      paddingLeft: '1rem', 
      paddingRight: '1rem', 
      marginTop: '0.5rem',
    },
    activityItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80px',
      height: '80px',
      margin: '10px',
      backgroundColor: 'rgb(216, 180, 254)',
      borderRadius: '50%',
      padding: '1rem',
      textAlign: 'center',
      color: '#000',
      cursor: 'pointer',  // Add cursor pointer for better UX
    },
    activityIcon: {
      marginBottom: '5px',
    },
    activityName: {
      fontSize: '0.75rem',
      fontWeight: 'bold',
    }
  };

  
  return (
    <div>
      <div style={styles.header}>Engage in activities of choice</div>
      <div style={styles.activityList}>
        {activities.map((activity, index) => (
          <div onClick={() => navigate(activity.component)}key={index} style={styles.activityItem}>
            <div style={styles.activityIcon}>{activity.icon}</div>
            <span style={styles.activityName}>{activity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoiceActivities;