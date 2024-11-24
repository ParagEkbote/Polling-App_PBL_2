import { NextRequest, NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Explicitly declare runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Use process from global scope
const dbPath = path.join(process.cwd(), 'db.json');

//Function to read the JSON database
const readDatabase = async () => {
    try {
      const data = await fsPromises.readFile(dbPath, 'utf8');
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

//Function to write to the JSON database
const writeDatabase = async (data: any) => {
  try {
    await fsPromises.writeFile(dbPath, JSON.stringify(data, null, 2));  // Pretty-print JSON with 2-space indent
  } catch (error) {
    throw new Error('Failed to write to database');
  }
};

export async function GET() {
  try {
    const data = await readDatabase();
    return NextResponse.json(data.polls, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/polls:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await readDatabase();
    const body = await request.json();

    //Validation of the incoming request
    if (!body.question || !Array.isArray(body.options) || body.options.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: question and options are required' },
        { status: 400 }
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await readDatabase();
    const body = await request.json();

    const { pollId, optionId } = body;

    // Validate input from the user
    if (!pollId || !optionId) {
      return NextResponse.json(
        { error: 'Poll ID and Option ID are required' },
        { status: 400 }
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

    // Increment vote count in the database.
    option.votes++;

    await writeDatabase(data);

    return NextResponse.json(poll, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/polls:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}