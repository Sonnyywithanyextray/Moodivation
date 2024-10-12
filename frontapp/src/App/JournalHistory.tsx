import React from 'react';
import { HistoryContainer, HistoryItem, HistoryTitle } from './styles';

interface JournalHistoryProps {
  history: Array<{ id: string; entry: string; date: Date }>;
}

const JournalHistory: React.FC<JournalHistoryProps> = ({ history }) => {
  return (
    <HistoryContainer>
      <HistoryTitle>Journal History</HistoryTitle>
      {history.length === 0 ? (
        <p>No journal entries yet.</p>
      ) : (
        history.map(item => (
          <HistoryItem key={item.id}>
            <p>{item.entry}</p>
            <small>{item.date.toDateString()}</small>
          </HistoryItem>
        ))
      )}
    </HistoryContainer>
  );
};

export default JournalHistory;
