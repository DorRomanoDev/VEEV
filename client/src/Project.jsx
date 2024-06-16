import React from 'react';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Detail = ({ title, detail }) => (
    <Typography>
        <Typography fontWeight="bold" variant="span">
            {title}
        </Typography>
        {detail}
    </Typography>
);


const ProjectDetails = () => {
    const { projectId } = useParams();
    const [projectDetails, setProjectDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [newCost, setNewCost] = useState('');



    useEffect(() => {
        axios.get(`http://localhost:3000/projects/${projectId}`)
            .then((response) => {
                setProjectDetails(response.data);
                setNewStatus(response.data.status)
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching project details:', error);
                setError(error);
                setLoading(false);
            });
    }, [projectId]);

    if (loading) {
        return <div>Loading project details...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!projectDetails) {
        return <div>No project details found for ID: {projectId}</div>;
    }


    const handleUpdate = () => {
        axios.put(`http://localhost:3000/projects/${projectId}`, {
            status: newStatus,
            currentCost: newCost,
        })
            .then((response) => {
                // Optionally update local state with the updated project details
                console.log('Project updated:', response.data);
            })
            .catch((error) => {
                console.error('Error updating project:', error);
            });
    };

    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    const handleCostChange = (event) => {
        setNewCost(event.target.value);
    };
    const isOverBudget = () => projectDetails && parseInt(projectDetails.currentCost, 10) > parseInt(projectDetails.startingBudget, 10);
    const isProjectClosed = () => projectDetails.status === "Forced Closed"



    return (
        <div>
            <Typography variant="h3">Project Details</Typography>
            <Detail title={"Project Name:"} detail={projectDetails.name} />
            <Detail title={"Description:"} detail={projectDetails.description} />
            <Detail title={"Start Date:"} detail={projectDetails.startDate} />
            <Detail title={"Estimated Completion Date:"} detail={projectDetails.completionDate} />
            <Detail title={"Current Status:"} detail={projectDetails.status} />
            <Detail title={"Starting Budget:"} detail={projectDetails.startingBudget} />
            <Detail title={"Current Cost:"} detail={projectDetails.currentCost} />
            {isOverBudget(projectDetails.currentCost) &&
                <Detail title={"isOverBudget:"} detail={" YES"} />}

            <label>Status:</label>
            <select disabled={isProjectClosed()} defaultValue={projectDetails.status} value={newStatus} onChange={handleStatusChange}>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                {isProjectClosed() && <option value="Forced Closed">Forced Closed</option>}
            </select>
            <br />
            {/* Current Cost Update */}
            <label>New Cost:</label>
            <input disabled={isProjectClosed()} type="number" value={newCost} onChange={handleCostChange} />
            <br />
            <button disabled={isProjectClosed()} onClick={handleUpdate}>Update Project</button>
        </div>
    )
}

export default ProjectDetails;