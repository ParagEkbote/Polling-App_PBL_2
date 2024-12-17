import React, { FormEvent, useState } from 'react';
import { Card } from '../components/ui';
import { Button } from '../components/ui';
import { Label } from '../components/ui';
import { Input } from '../components/ui';
import { X } from 'lucide-react';
import GoogleFormCard from './GoogleFormCard';

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
    <Card className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Poll</h1>
      <p className="text-gray-600 mb-6">Enter a question and at least two options for your poll.</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question" className="text-lg font-medium">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="w-full text-lg p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={100}
            />
          </div>

          {options.map((option, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Label htmlFor={`option-${index}`} className="font-medium">Option {index + 1}</Label>
                <Input
                  id={`option-${index}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={50}
                />
              </div>
              <div className="flex gap-2 mt-6">
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button type="button" onClick={addOption} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md">
              Add Option
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md">
              Create Poll
            </Button>
            <Button type="button" onClick={handleReset} variant="primary" className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md">
              Reset Text
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-8 border-t border-gray-300 pt-6">
        <GoogleFormCard />
      </div>
    </Card>
  );
};

export default PollForm;
