import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectList from './ProjectList';
import ProjectDetails from './Project';
import AddProjectPage from './AddProjectPage';
import StatisticsPage from './statisticsPage';

const MyRoutes = () => {
    return (
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<ProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route exact path="/add-project" element={<AddProjectPage />} /> 
        <Route exact path="/statistics" element={<StatisticsPage />} /> 
        <Route element={<div>Not found page</div>} />
        </Routes>
    </BrowserRouter>
    )
}

export default MyRoutes;