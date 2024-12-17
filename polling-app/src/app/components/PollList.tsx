import React from 'react';

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
    <div className="space-y-8">
      {polls.map((poll) => (
        <div key={poll.id} className="space-y-4">
          <h3 className="text-lg font-medium">{poll.question}</h3>
          {poll.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onVote(poll.id, option.id)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
