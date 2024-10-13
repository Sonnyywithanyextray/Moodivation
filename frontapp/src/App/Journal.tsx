import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { 
  JournalContainer, 
  JournalHeader, 
  HistoryContainer, 
  HistoryTitle, 
  HistoryItem, 
  NewButton, 
  JournalContent, 
} from './styles';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Leaf, ArrowLeft  } from 'lucide-react';
import JournalInput from './JournalInput'; // Import the new JournalInput component
import { useNavigate } from 'react-router-dom';

interface JournalEntry {
  id: string;
  entry: string;
  date: Date;
}

const JournalApp: React.FC = () => {
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
  const [showInput, setShowInput] = useState(false); // Changed to showInput for direct rendering
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
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
      userId: user.uid,
    });
    setShowInput(false); // Close the input after submission
    fetchJournalHistory(); // Refresh the journal history
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the user clicks outside the input field, close it
    if (showInput && !e.currentTarget.contains(e.target as Node)) {
      setShowInput(false);
    }
  };
  const handleBack = () => {
    navigate('/dashboard'); // Navigate back to the dashboard
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <JournalContainer onClick={handleOutsideClick}> {/* Close input on outside click */}
      <JournalContent>
        <JournalHeader>
          <ArrowLeft onClick={handleBack} style={{ cursor: 'pointer', marginRight:"40px" }} />
          
          <Leaf color="#f5f5f5" size={30} />
          <h3>Moodivation</h3>
        </JournalHeader>
        <NewButton onClick={() => setShowInput(true)}>Create New Entry</NewButton>

        {/* Render JournalInput based on showInput state */}
        {showInput && (
          <JournalInput onSubmit={handleJournalSubmit} onCancel={() => setShowInput(false)} />
        )}

        <HistoryContainer>
          <HistoryTitle>Journal History</HistoryTitle>
          {journalHistory.length === 0 ? (
            <p>No journal entries yet.</p>
          ) : (
            journalHistory.map((entry) => (
              <HistoryItem key={entry.id}>
                <p>{entry.entry}</p>
                <small>{entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString()}</small>
              </HistoryItem>
            ))
          )}
        </HistoryContainer>
      </JournalContent>
    </JournalContainer>
  );
};

export default JournalApp;
