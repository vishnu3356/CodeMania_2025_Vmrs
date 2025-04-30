const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample resource data
const resources = [
    { id: 1, name: "Resource One", description: "First resource description", rating: 5, lat: 17.3850, lon: 78.4867 },
    { id: 2, name: "Resource Two", description: "Second resource description", rating: 4, lat: 17.4000, lon: 78.4800 }
];

// Endpoint to fetch resources
app.get('/resources', (req, res) => {
    res.json(resources);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});