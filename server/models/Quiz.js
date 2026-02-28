const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String
});

const quizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAIGenerated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);