import React from 'react';
import { SentimentContainer, SentimentTitle, SuggestionText } from './styles';

interface SentimentAnalysisProps {
  sentiment: string | null;
  suggestion: string;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentiment, suggestion }) => {
  if (!sentiment) return null; // Do not render if there's no sentiment

  return (
    <SentimentContainer sentiment={sentiment}>
      <SentimentTitle>Sentiment Analysis: {sentiment}</SentimentTitle>
      <SuggestionText>{suggestion}</SuggestionText>
    </SentimentContainer>
  );
};

export default SentimentAnalysis;
