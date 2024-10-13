// Journal.tsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase'; // Ensure auth is exported from firebase.ts
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  JournalContainer, 
  JournalHeader, 
  HistoryContainer, 
  HistoryTitle, 
  HistoryItem, 
  NewButton, 
  JournalContent 
} from './styles';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Leaf } from 'lucide-react';
import JournalInput from './JournalInput';

interface JournalEntry {
  id: string;
  entry: string;
  date: Date;
}

const JournalApp: React.FC = () => {
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      fetchJournalHistory();
    }
  }, [user]);

  const fetchJournalHistory = async () => {
    const journalsRef = collection(db, "Journals");
    const q = query(journalsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    const historyData = snapshot.docs.map(doc => ({
      id: doc.id,
      entry: doc.data().entry,
      date: doc.data().date.toDate()
    }));
    setJournalHistory(historyData);
  };

  const handleJournalSubmit = async (entry: string) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    await addDoc(collection(db, "Journals"), {
      entry: entry,
      date: Timestamp.now(),
      userId: user.uid, // Now 'user' is defined
    });
    setShowInput(false);
    fetchJournalHistory();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <JournalContainer>
      <JournalContent>
        <JournalHeader>
          <Leaf color="#f5f5f5" size={30} />
          <h3>Moodivation</h3>
        </JournalHeader>
        <NewButton onClick={() => setShowInput(true)}>Create New Entry</NewButton>
        {showInput && <JournalInput onSubmit={handleJournalSubmit} />}
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
