//poll.tsx
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';  // Use the promise-based version of 'fs'
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(process.cwd(), 'db.json');

// Helper function to read the JSON database file
const readDatabase = async () => {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or can't be read, return a default structure
    return { polls: [] };
  }
};

// Helper function to write to the JSON database file
const writeDatabase = async (data: any) => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error('Error writing to the database');
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const data = await readDatabase();
      res.status(200).json(data.polls);
      
    } else if (req.method === 'POST') {
      const { question, options } = req.body;
      
      //Validation Logic for the API
      if (!question || !Array.isArray(options) || options.length === 0) {
        return res.status(400).json({ message: 'Invalid input: question and options are required' });
      }
      
      const data = await readDatabase();
      const newPoll = {
        id: uuidv4(),
        question,
        options: options.map((option: string) => ({
          id: uuidv4(),
          text: option,
          votes: 0,
        })),
      };
      
      data.polls.push(newPoll);
      await writeDatabase(data);
      res.status(201).json(newPoll);
      
    } else if (req.method === 'PUT') {
      const { pollId, optionId } = req.body;
      
      // Validate Input from the user
      if (!pollId || !optionId) {
        return res.status(400).json({ message: 'Poll ID and Option ID are required' });
      }

      const data = await readDatabase();
      const poll = data.polls.find((poll: any) => poll.id === pollId);
      
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
      }
      
      const option = poll.options.find((option: any) => option.id === optionId);
      if (!option) {
        return res.status(404).json({ message: 'Option not found' });
      }
      
      option.votes++;
      await writeDatabase(data);
      res.status(200).json(poll);
      
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
