import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Link,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/calls/logs');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching call logs:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (id) => {
    navigate(`/details/${id}`);
  };

  const sortLogs = (logs) => {
    return logs
      .filter(
        (item) =>
          item.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        // First, prioritize by "Not Sorted" status
        if (a.status === 'Not Sorted' && b.status !== 'Not Sorted') return -1;
        if (a.status !== 'Not Sorted' && b.status === 'Not Sorted') return 1;

        // If status is the same, prioritize by "Critical" priority first
        if (a.priority === 'Critical' && b.priority !== 'Critical') return -1;
        if (a.priority !== 'Critical' && b.priority === 'Critical') return 1;

        // If both status and priority are the same, maintain order
        return 0;
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 15 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button
          variant="contained"
          sx={{
            ml: 1,
            minWidth: 40,
            padding: '6px',
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          🔍
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.NO</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortLogs(data).map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell> {/* Assign serial number based on index */}
                <TableCell>{item.priority}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Link
                    href="#"
                    underline="hover"
                    onClick={() => handleViewDetails(item.callLogId)}
                  >
                    View Details
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Logs;