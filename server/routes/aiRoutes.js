
const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateQuiz,
  summarizeCourse,
  chatTutor,
  generateDescription
} = require('../controllers/aiController');

router.post('/generate-quiz', protect, generateQuiz);
router.post('/summarize', protect, summarizeCourse);
router.post('/chat', protect, chatTutor);
router.post('/generate-description', protect, generateDescription);

module.exports = router;