import styled from 'styled-components';

// Journal container styling
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
  justify-content: center;
  height: 100px;
  background-color: #4CAF50;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  width: 100%;
`;

// Main content and journal input styles
export const JournalContent = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 1rem;
  box-sizing: border-box;
`;

export const NewButton = styled.button`
  margin-top: 20px;
  padding: 10px 15px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
export const InputContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

// Text input field
export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

// Submit button

// Cancel button
export const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #d32f2f;
  }
`;
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Main modal content styling
export const ModalContent = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

// Modal header styling, similar to the journal header
export const ModalHeader = styled.div`
  background-color: #4CAF50;
  padding: 20px;
  text-align: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: white;
`;

// Textarea for the journal input
export const JournalTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 20px;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

// Submit button with consistent style as journal's submit button
export const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 15px;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: #0056b3;
  }
`;

// Cancel button
export const CloseButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;

  &:hover {
    background-color: #d32f2f;
  }
`;

// History styles
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
