const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  completedAt: { type: Date },
  quizScores: [{
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number,
    takenAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);