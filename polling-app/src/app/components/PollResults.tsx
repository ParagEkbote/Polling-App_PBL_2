// PollResults.tsx

// Import necessary libraries and components
import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

// Define the interface for an option in the poll
interface Option {
  id: string;
  text: string;
  votes: number;
}

// Define the interface for PollResults props
interface PollResultsProps {
  initialOptions: Option[];
}

// PollResults component definition
const PollResults: React.FC<PollResultsProps> = ({ initialOptions }) => {
  // Manage the state of options with votes
  const [options, setOptions] = useState(initialOptions);

  // Calculate the total number of votes
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  // Handle resetting votes for all options
  const handleResetVotes = () => {
    const resetOptions = options.map(option => ({
      ...option,
      votes: 0,
    }));
    setOptions(resetOptions);
  };

  return (
    <div>
      {options.map((option) => (
        <div key={option.id} className="mb-2">
          <div>{option.text}</div>
          <ProgressBar
            now={totalVotes ? (option.votes / totalVotes) * 100 : 0}
            label={`${option.votes} votes (${totalVotes ? ((option.votes / totalVotes) * 100).toFixed(1) : 0}%)`}
          />
        </div>
      ))}
      <button onClick={handleResetVotes} className="btn btn-primary mt-3">
        Reset Poll Count
      </button>
    </div>
  );
};

export default PollResults;
