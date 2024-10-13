import React, { useState } from 'react';
import { InputContainer, InputField, SubmitButton, CancelButton } from './styles'; // Import styles

interface JournalInputProps {
  onSubmit: (entry: string) => void;
  onCancel?: () => void; // Optional cancel function to close modal if neexded
}

const JournalInput: React.FC<JournalInputProps> = ({ onSubmit, onCancel }) => {
  const [entry, setEntry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry.trim()) {
      onSubmit(entry);
      setEntry(''); // Clear input after submission
    }
  };

  return (
    <InputContainer onSubmit={handleSubmit}>
      
      <InputField
        type="text"
        placeholder="Write your journal entry..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      <SubmitButton type="submit">Submit</SubmitButton>
      {onCancel && <CancelButton type="button" onClick={onCancel}>Cancel</CancelButton>}
    </InputContainer>
  );
};

export default JournalInput;
