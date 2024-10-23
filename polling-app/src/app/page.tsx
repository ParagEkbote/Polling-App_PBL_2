'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import PollForm from './components/PollForm';
import PollList from './components/PollList';
import { Poll } from './types';
import './styles.css';

interface PollCreationCardProps {
  onCreatePoll: (question: string, options: string[]) => Promise<void>;
}

interface ExistingPollsCardProps {
  polls: Poll[];
  loading: boolean;
  onVote: (pollId: string, optionId: string) => Promise<void>;
}

interface ErrorAlertProps {
  error: string | null;
}

interface LoadingSpinnerProps {
  loading: boolean;
}

const Header: React.FC = () => (
  <Row className="text-center mb-5 w-100">
    <Col>
      <h1 className="display-4 font-weight-bold text-center">
        <p style={{ marginBottom: '15px' }}>Polling App</p>
      </h1>
    </Col>
  </Row>
);

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => (
  error && (
    <Row className="text-center mb-3 w-100">
      <Col>
        <Alert variant="danger" className="alert-custom text-center">{error}</Alert>
      </Col>
    </Row>
  )
);

const PollCreationCard: React.FC<PollCreationCardProps> = ({ onCreatePoll }) => (
  <Col md={5} className="mb-4 d-flex justify-content-center">
    <Card className="shadow-lg text-center">
      <Card.Body>
        <Card.Title className="text-center mb-4 font-weight-bold">
          <p style={{ marginBottom: '50px' }}>Create a New Poll</p>
        </Card.Title>
        <PollForm onSubmit={onCreatePoll} />
      </Card.Body>
    </Card>
  </Col>
);

const ExistingPollsCard: React.FC<ExistingPollsCardProps> = ({ polls, loading, onVote }) => (
  <Col md={5} className="mb-4 d-flex justify-content-center">
    <Card className="shadow-lg text-center">
      <Card.Body>
        <Card.Title className="text-center mb-4 font-weight-bold">
        <p style={{ marginBottom: '35px' }}>Active Polls</p><br></br>
        </Card.Title>
        {polls.length === 0 && !loading ? (
          <p className="text-center">No polls available. Be the first to create one!</p>
        ) : (
          <PollList polls={polls} onVote={onVote} />
        )}
      </Card.Body>
    </Card>
  </Col>
);

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading }) => (
  loading && (
    <Row className="text-center mb-3 w-100">
      <Col>
        <Spinner animation="border" variant="primary" />
        <p>Loading polls...</p>
      </Col>
    </Row>
  )
);

const Page: React.FC = () => {
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
    <Container 
      className="d-flex flex-column justify-content-center align-items-center text-center min-vh-100"
      style={{
        backgroundColor: '#f0f8ff',
        maxWidth: '1400px',
        border: '2px solid black',
        borderRadius: '8px',
        padding: '20px'
      }}
    >
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

export default Page;