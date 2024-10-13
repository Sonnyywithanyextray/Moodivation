import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase'; // Ensure to import your firebase configuration
import { JournalContainer,JournalHeader,  HistoryContainer, HistoryTitle, HistoryItem, NewButton, JournalContent } from './styles';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import {

  Leaf,
} from 'lucide-react';
const JournalApp: React.FC = () => {
  const [journalHistory, setJournalHistory] = useState<{ id: string; entry: string; date: Date }[]>([]);

  useEffect(() => {
    // Fetch journal history from Firebase on component mount
    const fetchJournalHistory = async () => {
      const snapshot = await getDocs(collection(db, "Journals"));
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        entry: doc.data().entry,
        date: doc.data().date.toDate() // Convert Firebase timestamp to JavaScript Date
      }));
      setJournalHistory(historyData);
    };

    fetchJournalHistory();
  }, []);

  const handleJournalSubmit = async (entry: string) => {
 
  };

  return (
    <JournalContainer>
      <JournalContent>
     <JournalHeader>
    
     <Leaf color="#f5f5f5" size={30} />
      <h3>Moodivation</h3>
  
      {/* <p>Embrace every moment of possibility</p> */}
     </JournalHeader>
      <NewButton onClick={() => handleJournalSubmit(journalEntry)}>Create New Entry</NewButton>
      <HistoryContainer>
        <HistoryTitle>Journal History</HistoryTitle>
        {journalHistory.map((entry) => (
          <HistoryItem key={entry.id}>
            <p>{entry.entry}</p>
            <small>{entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString()}</small>
          </HistoryItem>
        ))}
      </HistoryContainer>
      </JournalContent>
    </JournalContainer>
  );
};

export default JournalApp;
