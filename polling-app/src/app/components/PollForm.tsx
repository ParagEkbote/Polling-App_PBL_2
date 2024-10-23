import React, { FormEvent, useState } from 'react';
import { Card } from '../components/ui';
import { Button } from '../components/ui';
import { Label } from '../components/ui';
import { Input } from '../components/ui';

interface PollFormProps {
  onSubmit: (question: string, options: string[]) => void;
}

const PollForm: React.FC<PollFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '']);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(question, options.filter(option => option !== ''));
  };
  
  return (
    <Card className="w-full max-w-md p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-base font-medium">
              Question
            </Label>
            <Input
              id="question"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {options.map((option, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`option-${index}`} className="text-base font-medium">
                Option {index + 1}
              </Label>
              <Input
                id={`option-${index}`}
                type="text"
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
        </div>

        <Button type="submit" className="w-full">
          Create Poll
        </Button>
      </form>
    </Card>
  );
};

export default PollForm;