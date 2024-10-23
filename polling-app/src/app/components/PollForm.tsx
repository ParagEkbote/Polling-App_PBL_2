import React, { FormEvent, useState } from 'react';
import { Card } from '../components/ui';
import { Button } from '../components/ui';
import { Label } from '../components/ui';
import { Input } from '../components/ui';
import { X } from 'lucide-react';


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

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
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
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
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
              <div className="flex gap-2 mt-6">
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button type="button" onClick={addOption}>
              Add Option
            </Button>
            <Button type="submit">Create Poll</Button>
            <Button type="button" onClick={handleReset} variant="primary">
              Reset Text
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default PollForm;
