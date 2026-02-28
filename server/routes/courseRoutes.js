const router = require('express').Router();
const { protect, instructorOnly } = require('../middleware/authMiddleware');

// We will add controller functions later
router.get('/', protect, (req, res) => res.json({ message: 'Get all courses' }));
router.post('/', protect, instructorOnly, (req, res) => res.json({ message: 'Create course' }));
router.get('/:id', protect, (req, res) => res.json({ message: 'Get single course' }));
router.put('/:id', protect, instructorOnly, (req, res) => res.json({ message: 'Update course' }));
router.delete('/:id', protect, instructorOnly, (req, res) => res.json({ message: 'Delete course' }));

module.exports = router;