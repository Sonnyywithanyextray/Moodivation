import styled from 'styled-components';

// Define an interface for the props you want to use
interface SentimentProps {
  sentiment: string; // You can use a union type if you have specific values
}

export const JournalContainer = styled.div`
    background-color: black;
    color: white;
      min-height: 100vh;
      width: 100%;
      padding: 1rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
`;
export const JournalHeader = styled.div`
    display: flex;
    align-items: center;
    height:100px;
    justify-content: center;
    margin-bottom: 1.5rem;
    background-color:#4CAF50;
    border-top-right-radius:10px;
    border-top-left-radius:10px
`;
export const JournalContent = styled.div`
    width: 100%;
max-width: 480px;
padding:1rem;
box-sizing: border-box;
`;

export const NewButton = styled.button`
  margin-top: 10px;
  padding: 10px 15px;
  align-items: center;
  justify-content: center;
  float:center;
  align-content:center;
  width:70%;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 30px;
  box-shadow: 10px white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const JournalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

export const JournalTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 15px;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const SentimentContainer = styled.div<SentimentProps>`
  margin: 20px 0;
  padding: 15px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.sentiment === 'positive'
      ? '#d4edda'
      : props.sentiment === 'negative'
      ? '#f8d7da'
      : '#fff3cd'};
`;

export const SentimentTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

export const SuggestionText = styled.p`
  font-size: 1rem;
`;

export const HistoryContainer = styled.div`
  margin: 20px 0;
`;

export const HistoryTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

export const HistoryItem = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px 0;

  &:last-child {
    border-bottom: none;
  }
`;
