import React, { useState } from 'react';
import { JournalContainer, JournalTitle, JournalTextArea, SubmitButton } from './styles';

interface JournalInputProps {
  onSubmit: (entry: string) => void;
}

const JournalInput: React.FC<JournalInputProps> = ({ onSubmit }) => {
  const [journalEntry, setJournalEntry] = useState("");

  const handleSubmit = () => {
    if (journalEntry.trim() === "") return;
    onSubmit(journalEntry);
    setJournalEntry("");
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