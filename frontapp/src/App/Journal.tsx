import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase'; // Ensure to import your firebase configuration
import { JournalContainer, JournalTitle, JournalTextArea, SubmitButton, HistoryContainer, HistoryTitle, HistoryItem } from './styles';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const JournalApp: React.FC = () => {
  const [journalEntry, setJournalEntry] = useState<string>("");
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
    if (entry.trim() === "") return;

    // Store the journal entry in Firebase
    await addDoc(collection(db, "Journals"), {
      entry: entry,
      date: new Date(),
    });

    // Update local state
    setJournalHistory(prevHistory => [
      ...prevHistory,
      { id: Math.random().toString(), entry, date: new Date() } // Add the new entry locally
    ]);
    setJournalEntry(""); // Clear the input after submission
  };

  return (
    <JournalContainer>
      <JournalTitle>Daily Journal</JournalTitle>
      <JournalTextArea 
        value={journalEntry} 
        onChange={(e) => setJournalEntry(e.target.value)} 
        placeholder="Write your journal entry here..." 
      />
      <SubmitButton onClick={() => handleJournalSubmit(journalEntry)}>
        Submit
      </SubmitButton>
      
      <HistoryContainer>
        <HistoryTitle>Journal History</HistoryTitle>
        {journalHistory.map((entry) => (
          <HistoryItem key={entry.id}>
            <p>{entry.entry}</p>
            <small>{entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString()}</small>
          </HistoryItem>
        ))}
      </HistoryContainer>
    </JournalContainer>
  );
};

export default JournalApp;
