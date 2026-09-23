const express = require('express');
const studentRoutes = require('./routes/studentRoutes');
const logger = require('./middleware/logger');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Custom Logger Middleware
app.use(logger);

// Modular Routing
app.use('/students', studentRoutes);

// Welcome / Home route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Student Management REST API',
        endpoints: {
            getAllStudents: 'GET /students',
            getStudentById: 'GET /students/:id',
            createStudent: 'POST /students',
            updateStudent: 'PUT /students/:id',
            deleteStudent: 'DELETE /students/:id'
        }
    });
});

// Handle unknown routes (404)
app.use((req, res) => {
    res.status(404).json({ message: 'Route Not Found' });
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;

