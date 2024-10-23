import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface PollResultsProps {
  initialOptions: Option[];
}

const PollResults: React.FC<PollResultsProps> = ({ initialOptions }) => {
  // Manage the state of options with votes in the parent
  const [options, setOptions] = useState(initialOptions);

  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

  const handleResetVotes = () => {
    // Reset votes for all options to zero
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
