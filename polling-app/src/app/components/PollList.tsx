import React from 'react';
import { ListGroup } from 'react-bootstrap';

// Define the Poll type structure
interface Option {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: Option[];
}

interface PollListProps {
  polls: Poll[];
  onVote: (pollId: string, optionId: string) => void;
}

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
                margin: '5px',
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
