const router = require('express').Router();
const { protect, instructorOnly } = require('../middleware/authMiddleware');

// We will add controller functions later
router.get('/:courseId', protect, (req, res) => res.json({ message: 'Get quizzes for course' }));
router.post('/', protect, instructorOnly, (req, res) => res.json({ message: 'Create quiz' }));

module.exports = router;