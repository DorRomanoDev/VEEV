const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json());
const PORT = 3000;
const DATA_FILE = 'projects.json';

const readData = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  };
  
  const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  };
  
  app.get('/projects', (req, res) => {
    const projects = readData();
    res.json(Object.values(projects));
  });
  
  app.get('/projects/:id', (req, res) => {
    const projects = readData();
    const project = projects[req.params.id];
    if (project) {
      res.json(project);
    } else {
      res.status(404).send('Project not found');
    }
  });
  
app.put('/projects/:id', (req, res) => {
    const projects = readData();
    const project = projects[req.params.id];
    if (project) {
      if (req.body.status) {
        project.status = req.body.status;
      }
      if (req.body.currentCost) {
        project.currentCost = req.body.currentCost;
      }
  
      // Calculate the number of days since project start
      const startDate = new Date(project.startDate);
      const currentDate = new Date();
      const daysPassed = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // Adding 1 to include the start day
  
      // Calculate the daily budget consumption
      const dailyBudgetConsumption = project.startingBudget * 0.1;
  
      // Update current cost based on automatic daily consumption
      const automaticCost = daysPassed * dailyBudgetConsumption;
      project.currentCost = Math.max(project.currentCost, automaticCost); // Ensure current cost never decreases
  
      // Check if project should be forced-closed
      const costThreshold = project.startingBudget * 1.5; // 50% above starting budget
      console.log(project.currentCost > costThreshold);
      if (project.currentCost > costThreshold) {
        project.status = "Forced Closed";
      }

      writeData(projects);
      res.json(project);
    } else {
      res.status(404).send('Project not found');
    }
  });
  
  

  app.post('/projects', (req, res) => {
    const projects = readData();
    const newId = Object.keys(projects).length ? Math.max(...Object.keys(projects).map(Number)) + 1 : 1;
    const newProject = {
      id: newId,
      ...req.body
    };
    projects[newId] = newProject;
    writeData(projects);
    res.status(201).json(newProject);
  });

  app.get('/projects/status/:status', (req, res) => {
    const projects = readData();
    const filteredProjects = Object.values(projects).filter(project => project.status === req.params.status);
    res.json(filteredProjects);
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });