'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import PollForm from './components/PollForm';
import PollList from './components/PollList';
import { Poll } from './types'; // Import Poll from types.ts
import './styles.css'; // Import your custom CSS file for additional styling

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('/api/polls');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPolls(data);
      setError(null);
    } catch (error: any) {
      setError("Failed to fetch polls. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async (question: string, options: string[]) => {
    setLoading(true);
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
    setLoading(true);
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
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 font-weight-bold">Polling App</h1>
          <p className="lead">Create and vote on polls easily!</p>
        </Col>
      </Row>

      {loading && (
        <Row className="text-center mb-3">
          <Col>
            <Spinner animation="border" variant="primary" />
            <p>Loading polls...</p>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="text-center mb-3">
          <Col>
            <Alert variant="danger" className="alert-custom">{error}</Alert>
          </Col>
        </Row>
      )}

      <Row className="justify-content-center">
        <Col md={5} className="mb-4">
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center mb-4 font-weight-bold">Create a New Poll</Card.Title>
              <PollForm onSubmit={handleCreatePoll} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={5} className="mb-4">
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center mb-4 font-weight-bold">Existing Polls</Card.Title>
              {polls.length === 0 && !loading ? (
                <p className="text-center">No polls available yet. Create one!</p>
              ) : (
                <PollList polls={polls} onVote={handleVote} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
