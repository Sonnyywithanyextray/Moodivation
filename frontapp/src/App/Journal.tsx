import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, where } from 'firebase/firestore';
import { Leaf, ArrowLeft, Edit3 } from 'lucide-react';
import JournalInput from './JournalInput';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface JournalEntry {
  id: string;
  entry: string;
  date: Date;
}

const JournalApp: React.FC = () => {
  const [journalHistory, setJournalHistory] = useState<JournalEntry[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchJournalHistory();
    }
  }, [user]);

  const fetchJournalHistory = async () => {
    if (!user) return;

    const journalsRef = collection(db, "Journals");
    const q = query(
      journalsRef,
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    try {
      const snapshot = await getDocs(q);
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        entry: doc.data().entry,
        date: doc.data().date.toDate()
      }));
      setJournalHistory(historyData);
    } catch (error: any) {
      console.error("Error fetching journal history:", error);
      if (error.code === 'failed-precondition' || error.code === 'unimplemented') {
        console.log("Index might be missing. Please check Firebase Console.");
      }
      // Fallback to fetching without ordering if there's an error
      try {
        const fallbackQ = query(journalsRef, where("userId", "==", user.uid));
        const fallbackSnapshot = await getDocs(fallbackQ);
        const fallbackHistoryData = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          entry: doc.data().entry,
          date: doc.data().date.toDate()
        })).sort((a, b) => b.date.getTime() - a.date.getTime());
        setJournalHistory(fallbackHistoryData);
      } catch (fallbackError) {
        console.error("Error fetching journal history (fallback):", fallbackError);
      }
    }
  };

  const handleJournalSubmit = async (entry: string) => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    try {
      await addDoc(collection(db, "Journals"), {
        entry: entry,
        date: Timestamp.now(),
        userId: user.uid,
      });
      setShowInput(false);
      fetchJournalHistory();
    } catch (error) {
      console.error("Error adding journal entry:", error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        backgroundColor: 'black',
        minHeight: '100vh',
        width: '100%',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '800px',
        padding: '2rem',
        boxSizing: 'border-box',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <ArrowLeft onClick={handleBack} style={{ cursor: 'pointer', marginRight: '1.5rem' }} size={32} />
          <Leaf color="#f5f5f5" size={48} style={{ marginRight: '1.5rem' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: '600', margin: 0 }}>Journal</h1>
        </header>

        <button
          onClick={() => setShowInput(true)}
          style={{
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            fontWeight: '500',
            marginBottom: '2rem',
            width: '100%',
          }}
        >
          <Edit3 size={24} style={{ marginRight: '0.75rem' }} />
          Create New Entry
        </button>

        {showInput && (
          <JournalInput onSubmit={handleJournalSubmit} onCancel={() => setShowInput(false)} />
        )}

        <div style={{ flex: 1, overflow: 'auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Journal History</h2>
          {journalHistory.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '1.25rem' }}>No journal entries yet.</p>
          ) : (
            journalHistory.map((entry) => (
              <div key={entry.id} style={{
                backgroundColor: '#1e1e1e',
                padding: '1.5rem',
                borderRadius: '0.75rem',
                marginBottom: '1.5rem',
              }}>
                <p style={{ marginBottom: '1rem', fontSize: '1.25rem', lineHeight: '1.6' }}>{entry.entry}</p>
                <small style={{ color: '#9ca3af', fontSize: '1rem' }}>
                  {entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString()}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JournalApp;