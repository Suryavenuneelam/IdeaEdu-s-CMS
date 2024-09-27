import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AppAppBar from '../components/navbar';
import Logs from '../components/logs';

function LogsPage() {
  const navigate = useNavigate(); // Use useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check for the token

    if (!token) {
      // Redirect to login if token doesn't exist
      navigate('/signin'); // Replace with your login route
    }
  }, [navigate]);

  return (
    <div className="App">
      <AppAppBar />
      <Logs />
    </div>
  );
}

export default LogsPage;