const express = require('express');
const router = express.Router();
let students = require('../data/students');

// GET /students - View all students
router.get('/', (req, res) => {
    res.status(200).json(students);
});

// GET /students/:id - View Student by ID
router.get('/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const student = students.find(s => s.id === studentId);

    if (!student) {
        return res.status(404).json({ message: 'Student Not Found' });
    }

    res.status(200).json(student);
});

// POST /students - Create Student
router.post('/', (req, res) => {
    const { name, course } = req.body;

    if (!name || !course) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const newStudent = { id: newId, name, course };
    
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// PUT /students/:id - Update Student
router.put('/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const { name, course } = req.body;

    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student Not Found' });
    }

    if (!name && !course) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    // Update fields
    if (name) students[studentIndex].name = name;
    if (course) students[studentIndex].course = course;

    res.status(200).json(students[studentIndex]);
});

// DELETE /students/:id - Delete Student
router.delete('/:id', (req, res) => {
    const studentId = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student Not Found' });
    }

    // Remove student
    students.splice(studentIndex, 1);
    res.status(200).json({ message: 'Student removed successfully' });
});

module.exports = router;
