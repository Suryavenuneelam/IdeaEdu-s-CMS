import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead
import AppAppBar from '../components/navbar';
import IssueForm from '../components/issueForm';

function Signinpage() {
  const navigate = useNavigate(); // Use useNavigate instead

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
      <IssueForm />
    </div>
  );
}

export default Signinpage;