import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(process.cwd(), 'db.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    res.status(200).json(data.polls);
  } else if (req.method === 'POST') {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const newPoll = {
      id: uuidv4(),
      question: req.body.question,
      options: req.body.options.map((option: string) => ({
        id: uuidv4(),
        text: option,
        votes: 0
      }))
    };
    data.polls.push(newPoll);
    fs.writeFileSync(dbPath, JSON.stringify(data));
    res.status(201).json(newPoll);
  } else if (req.method === 'PUT') {
    const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const { pollId, optionId } = req.body;
    const pollIndex = data.polls.findIndex((poll: any) => poll.id === pollId);
    if (pollIndex !== -1) {
      const optionIndex = data.polls[pollIndex].options.findIndex((option: any) => option.id === optionId);
      if (optionIndex !== -1) {
        data.polls[pollIndex].options[optionIndex].votes++;
        fs.writeFileSync(dbPath, JSON.stringify(data));
        res.status(200).json(data.polls[pollIndex]);
      } else {
        res.status(404).json({ message: 'Option not found' });
      }
    } else {
      res.status(404).json({ message: 'Poll not found' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}