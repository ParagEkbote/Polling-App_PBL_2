import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';  // Use promise-based fs
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dbPath = path.join(process.cwd(), 'db.json');

// Helper function to read the JSON database
const readDatabase = async () => {
    try {
      const data = await fs.readFile(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        // Handle known error types
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return { polls: [] }; // Return default structure if file not found
        } else {
          throw new Error('Failed to read database: ' + error.message);
        }
      } else {
        throw new Error('Failed to read database: Unknown error');
      }
    }
  };

// Helper function to write to the JSON database
const writeDatabase = async (data: any) => {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));  // Pretty-print JSON with 2-space indent
  } catch (error) {
    throw new Error('Failed to write to database');
  }
};

export async function GET() {
  try {
    const data = await readDatabase();
    return new NextResponse(JSON.stringify(data.polls), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/polls:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await readDatabase();
    const body = await request.json();

    // Basic validation of the incoming request
    if (!body.question || !Array.isArray(body.options) || body.options.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid request: question and options are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
    await writeDatabase(data);

    return NextResponse.json(newPoll, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/polls:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await readDatabase();
    const body = await request.json();

    const { pollId, optionId } = body;

    // Validate input
    if (!pollId || !optionId) {
      return new NextResponse(
        JSON.stringify({ error: 'Poll ID and Option ID are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const poll = data.polls.find((poll: any) => poll.id === pollId);
    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    const option = poll.options.find((option: any) => option.id === optionId);
    if (!option) {
      return NextResponse.json({ error: 'Option not found' }, { status: 404 });
    }

    // Increment vote count
    option.votes++;

    await writeDatabase(data);

    return NextResponse.json(poll, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/polls:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
