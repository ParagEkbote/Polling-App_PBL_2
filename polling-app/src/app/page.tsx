'use client';  // Correct placement of 'use client'

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PollForm from './components/PollForm';
import PollList from './components/PollList';
import { Poll, Option } from './types';  // Import both Poll and Option from types.ts

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);  // Fixed string interpolation
      }
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error("Error fetching polls:", error);
      // Optionally set an error state here to display to the user
    }
  };

  const handleCreatePoll = async (question: string, options: string[]) => {
    await fetch('/api/polls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, options }),
    });
    fetchPolls();
  };

  const handleVote = async (pollId: string, optionId: string) => {
    await fetch('/api/polls', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pollId, optionId }),
    });
    fetchPolls();
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <h1>Polling App</h1>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={6}>
          <h2>Create a New Poll</h2>
          <PollForm onSubmit={handleCreatePoll} />
        </Col>
        <Col md={6}>
          <h2>Existing Polls</h2>
          <PollList polls={polls} onVote={handleVote} />
        </Col>
      </Row>
    </Container>
  );
}
