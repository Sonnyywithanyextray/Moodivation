import React, { useState } from 'react';
import { JournalContainer, JournalTitle, JournalTextArea, SubmitButton } from './styles';

interface JournalInputProps {
  onSubmit: (entry: string) => void;
}

const JournalInput: React.FC<JournalInputProps> = ({ onSubmit }) => {
  const [journalEntry, setJournalEntry] = useState("");


   
  const handleSubmit = async (entry: string) => {
    onSubmit(journalEntry);
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
      <JournalTitle>Today's Journal Entry</JournalTitle>
      <JournalTextArea
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
        placeholder="How do you feel today?"
      />
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </JournalContainer>
  );
};

export default JournalInput;
