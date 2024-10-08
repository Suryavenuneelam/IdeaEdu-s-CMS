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
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

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

  const filteredData = data.filter((item) => {
    return (
      item.sNo.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.sNo}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell>{item.client}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Link
                    href="#"
                    underline="hover"
                    onClick={() => handleViewDetails(item.callLogId)} // Pass the log ID to the handler
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