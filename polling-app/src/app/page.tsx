'use client';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import PollForm from './components/PollForm';
import PollList from './components/PollList';
import { Poll } from './types';
import './styles.css';

const Home: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/polls');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const fetchedPolls = await response.json();
      setPolls(fetchedPolls);
      setError(null);
    } catch (err) {
      setError("Failed to fetch polls. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async (question: string, options: string[]) => {
    try {
      setLoading(true);
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await loadPolls();
    } catch (err) {
      setError("Failed to create poll. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/polls', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId, optionId }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await loadPolls();
    } catch (err) {
      setError("Failed to register vote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100" style={{ backgroundColor: '#f0f8ff', maxWidth: '1400px' }}>
      <Header />
      <LoadingSpinner loading={loading} />
      <ErrorAlert error={error} />
      <Row className="justify-content-center w-100">
        <PollCreationCard onCreatePoll={handleCreatePoll} />
        <ExistingPollsCard polls={polls} loading={loading} onVote={handleVote} />
      </Row>
    </Container>
  );
};

const Header: React.FC = () => (
  <Row className="text-center mb-5 w-100">
    <Col>
      <h1 className="display-4 font-weight-bold text-center">Polling App</h1>
      <p className="lead text-center">Create and participate in polls with ease!</p>
    </Col>
  </Row>
);

const LoadingSpinner: React.FC<{ loading: boolean }> = ({ loading }) => (
  loading && (
    <Row className="text-center mb-3 w-100">
      <Col>
        <Spinner animation="border" variant="primary" />
        <p>Loading polls...</p>
      </Col>
    </Row>
  )
);

const ErrorAlert: React.FC<{ error: string | null }> = ({ error }) => (
  error && (
    <Row className="text-center mb-3 w-100">
      <Col>
        <Alert variant="danger" className="alert-custom text-center">{error}</Alert>
      </Col>
    </Row>
  )
);

const PollCreationCard: React.FC<{ onCreatePoll: (question: string, options: string[]) => Promise<void> }> = ({ onCreatePoll }) => (
  <Col md={5} className="mb-4 d-flex justify-content-center">
    <Card className="shadow-lg text-center">
      <Card.Body>
        <Card.Title className="text-center mb-4 font-weight-bold">Create a New Poll</Card.Title>
        <PollForm onSubmit={onCreatePoll} />
      </Card.Body>
    </Card>
  </Col>
);

const ExistingPollsCard: React.FC<{ polls: Poll[], loading: boolean, onVote: (pollId: string, optionId: string) => Promise<void> }> = ({ polls, loading, onVote }) => (
  <Col md={5} className="mb-4 d-flex justify-content-center">
    <Card className="shadow-lg text-center">
      <Card.Body>
        <Card.Title className="text-center mb-4 font-weight-bold">Active Polls</Card.Title>
        {polls.length === 0 && !loading ? (
          <p className="text-center">No polls available. Be the first to create one!</p>
        ) : (
          <PollList polls={polls} onVote={onVote} />
        )}
      </Card.Body>
    </Card>
  </Col>
);

export default Home;
