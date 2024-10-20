import React from 'react';
import { ProgressBar } from 'react-bootstrap';

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface PollResultsProps {
  options: Option[];
}

const PollResults: React.FC<PollResultsProps> = ({ options }) => {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div>
      {options.map((option) => (
        <div key={option.id} className="mb-2">
          <div>{option.text}</div>
          <ProgressBar
            now={(option.votes / totalVotes) * 100}
            label={`${option.votes} votes (${((option.votes / totalVotes) * 100).toFixed(1)}%)`}
          />
        </div>
      ))}
    </div>
  );
};

export default PollResults;