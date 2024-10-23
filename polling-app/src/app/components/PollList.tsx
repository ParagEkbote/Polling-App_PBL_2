// PollList.tsx

// Import necessary libraries and components
import React from 'react';

// Define the Poll type structure
interface Option {
  id: string;
  text: string;
  votes: number;
}

// Define the Poll interface structure
interface Poll {
  id: string;
  question: string;
  options: Option[];
}

// Define the PollList component's props
interface PollListProps {
  polls: Poll[];
  onVote: (pollId: string, optionId: string) => void;
}

// PollList component definition
const PollList: React.FC<PollListProps> = ({ polls, onVote }) => {
  return (
    <div>
      {polls.map((poll) => (
        <div key={poll.id} style={{ marginBottom: '20px' }}>
          <h3>{poll.question}</h3>
          {poll.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onVote(poll.id, option.id)} // Call the onVote function
              style={{
                margin: '10px',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
              }}
              aria-label={`Vote for ${option.text}`}
            >
              {option.text} ({option.votes})
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PollList;
