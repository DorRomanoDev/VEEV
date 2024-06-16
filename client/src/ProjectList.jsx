import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');


  const fetchProjects = (status = '') => {
    setLoading(true);
    let url = status ? `http://localhost:3000/projects/status/${status}` : 'http://localhost:3000/projects';

    axios.get(url)
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects(selectedStatus)
  }, [selectedStatus]);

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <h1>Projects</h1>
      <div>
        <Link to="/add-project">Add New Project</Link>
      </div>
      <br/>
      {/* <div>
        <Link to="/statistics">Statistics</Link>
      </div> */}
      <FormControl style={{ marginBottom: '20px', minWidth: 120 }}>
        <InputLabel id="status-filter-label">Status</InputLabel>
        <Select
          labelId="status-filter-label"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <MenuItem value=""><em>All</em></MenuItem>
          <MenuItem value="Planning">Planning</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Forced Closed">Forced Closed</MenuItem>
        </Select>
      </FormControl>
      <div style={{ height: '100%', width: '100%' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Project Name</TableCell>
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">Estimated Completion Date</TableCell>
                <TableCell align="center">Current Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">
                    <Link to={`/projects/${project.id}`}>{project.name}</Link>
                  </TableCell>
                  <TableCell align="center">{project.startDate}</TableCell>
                  <TableCell align="center">{project.completionDate}</TableCell>
                  <TableCell align="center">{project.status}</TableCell>
                  {/* TODO: Add missing fields */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
