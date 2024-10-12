import React, { CSSProperties } from 'react'; 
import {
  BookOpen,
  Headphones,
  Airplay,
  PenTool,
  Book,
  Music
} from 'lucide-react';

const ChoiceActivities: React.FC = () => {
  const activities = [
    { icon: <BookOpen size={32} />, name: 'Read stories' },
    { icon: <Headphones size={32} />, name: 'Listen to music' },
    { icon: <Airplay size={32} />, name: 'Breather' },
    { icon: <PenTool size={32} />, name: 'Draw' },
    { icon: <Book size={32} />, name: 'Journal' },
    { icon: <Music size={32} />, name: 'Dance' }
  ];

  const styles: { [key: string]: CSSProperties } = {
    activityList: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      backgroundColor: '#1e1e1e',
      padding: '1rem',
      marginTop: '1rem',
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
    <div style={styles.activityList}>
      {activities.map((activity, index) => (
        <div key={index} style={styles.activityItem}>
          <div style={styles.activityIcon}>{activity.icon}</div>
          <span style={styles.activityName}>{activity.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ChoiceActivities;
