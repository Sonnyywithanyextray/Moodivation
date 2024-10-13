import React, { useState } from 'react';

interface JournalInputProps {
  onSubmit: (entry: string) => void;
  onCancel?: () => void;
}

const JournalInput: React.FC<JournalInputProps> = ({ onSubmit, onCancel }) => {
  const [entry, setEntry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (entry.trim()) {
      onSubmit(entry);
      setEntry('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#1e1e1e',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '2rem',
    }}>
      <textarea
        placeholder="Write your journal entry..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        style={{
          width: '100%',
          minHeight: '250px',
          backgroundColor: '#2d2d2d',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          resize: 'vertical',
          fontSize: '1.25rem',
          lineHeight: '1.6',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            marginRight: '1rem',
            fontSize: '1.1rem',
          }}>
            Cancel
          </button>
        )}
        <button type="submit" style={{
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '1.1rem',
        }}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default JournalInput;