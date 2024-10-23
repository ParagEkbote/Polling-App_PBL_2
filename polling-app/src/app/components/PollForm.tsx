import React, { FormEvent, useState } from 'react';
import { Card } from '../components/ui';
import { Button } from '../components/ui';
import { Label } from '../components/ui';
import { Input } from '../components/ui';

interface PollFormProps {
  onSubmit: (question: string, options: string[]) => void;
}

const PollForm: React.FC<PollFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(question, options.filter(option => option !== ''));
  };

  const handleReset = () => {
    setQuestion('');
    setOptions(['', '']);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {options.map((option, index) => (
            <div key={index}>
              <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                required
                className="w-full"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <Button type="button" onClick={addOption}>
              Add Option
            </Button>
            <Button type="submit">Create Poll</Button>
            <Button type="button" onClick={handleReset} variant="primary">
              Reset Options
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default PollForm;