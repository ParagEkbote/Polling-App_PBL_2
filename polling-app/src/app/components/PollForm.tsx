import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface PollFormProps {
  onSubmit: (question: string, options: string[]) => void;
}

const PollForm: React.FC<PollFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(question, options.filter(option => option !== ''));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Question</Form.Label>
        <Form.Control
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
      </Form.Group>
      {options.map((option, index) => (
        <Form.Group key={index} className="mb-3">
          <Form.Label>Option {index + 1}</Form.Label>
          <Form.Control
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            required
          />
        </Form.Group>
      ))}
      <Button variant="primary" type="submit">
        Create Poll
      </Button>
    </Form>
  );
};

export default PollForm;