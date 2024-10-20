import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
    try {
      const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      return new Response(JSON.stringify(data.polls), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error in GET /api/polls:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

export async function POST(request: NextRequest) {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const body = await request.json();
  const newPoll = {
    id: uuidv4(),
    question: body.question,
    options: body.options.map((option: string) => ({
      id: uuidv4(),
      text: option,
      votes: 0
    }))
  };
  data.polls.push(newPoll);
  fs.writeFileSync(dbPath, JSON.stringify(data));
  return NextResponse.json(newPoll, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const body = await request.json();
  const { pollId, optionId } = body;
  const pollIndex = data.polls.findIndex((poll: any) => poll.id === pollId);
  if (pollIndex !== -1) {
    const optionIndex = data.polls[pollIndex].options.findIndex((option: any) => option.id === optionId);
    if (optionIndex !== -1) {
      data.polls[pollIndex].options[optionIndex].votes++;
      fs.writeFileSync(dbPath, JSON.stringify(data));
      return NextResponse.json(data.polls[pollIndex]);
    } else {
      return NextResponse.json({ message: 'Option not found' }, { status: 404 });
    }
  } else {
    return NextResponse.json({ message: 'Poll not found' }, { status: 404 });
  }
}