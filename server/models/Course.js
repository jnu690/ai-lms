const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String, default: '' },
  content: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);