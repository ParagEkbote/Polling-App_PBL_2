import React from 'react';
import { ListGroup } from 'react-bootstrap';

interface Poll {
  id: string;
  question: string;
  options: string[];
}

interface PollListProps {
  polls: Poll[];
}

const PollList: React.FC<PollListProps> = ({ polls }) => {
  return (
    <ListGroup>
      {polls.map((poll) => (
        <ListGroup.Item key={poll.id}>{poll.question}</ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PollList;