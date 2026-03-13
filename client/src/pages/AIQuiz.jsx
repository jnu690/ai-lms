import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AIQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=form, 2=quiz
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseTitle: '',
    courseContent: '',
    numberOfQuestions: 5
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/ai/generate-quiz', formData);
      setQuestions(data.questions);
      setStep(2);
      toast.success('Quiz generated successfully!');
    } catch (error) {
      toast.error('Failed to generate quiz. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionIndex]: answerIndex });
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    toast.success(`You scored ${correct}/${questions.length}!`);
  };

  const handleReset = () => {
    setStep(1);
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setFormData({ courseTitle: '', courseContent: '', numberOfQuestions: 5 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <Sparkles size={24} />
          AI Quiz Generator
        </h1>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* STEP 1: Form */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Generate a Quiz with AI 🤖</h2>
            <p className="text-gray-500 mb-6">Paste your course content and Claude AI will generate quiz questions!</p>

            <form onSubmit={generateQuiz} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  name="courseTitle"
                  value={formData.courseTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Introduction to JavaScript"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Content</label>
                <textarea
                  name="courseContent"
                  value={formData.courseContent}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Paste your lecture notes or course content here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Questions</label>
                <select
                  name="numberOfQuestions"
                  value={formData.numberOfQuestions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    AI is generating your quiz...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Quiz with AI
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Quiz */}
        {step === 2 && (
          <div>
            {/* Score Banner */}
            {submitted && (
              <div className={`p-6 rounded-2xl mb-6 text-center ${
                score >= questions.length * 0.7 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-4xl font-bold mb-2">
                  {score >= questions.length * 0.7 ? '🎉' : '😅'}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {score}/{questions.length} Correct
                </p>
                <p className="text-gray-500 mt-1">
                  {score >= questions.length * 0.7 ? 'Great job!' : 'Keep practicing!'}
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Generate New Quiz
                </button>
              </div>
            )}

            {/* Questions */}
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white p-6 rounded-2xl shadow-sm mb-4">
                <p className="font-semibold text-gray-800 mb-4">
                  {qIndex + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => {
                    let style = 'border border-gray-200 text-gray-700 hover:bg-indigo-50';
                    if (answers[qIndex] === oIndex && !submitted) {
                      style = 'border-2 border-indigo-500 bg-indigo-50 text-indigo-700';
                    }
                    if (submitted) {
                      if (oIndex === q.correctAnswer) {
                        style = 'border-2 border-green-500 bg-green-50 text-green-700';
                      } else if (answers[qIndex] === oIndex && oIndex !== q.correctAnswer) {
                        style = 'border-2 border-red-500 bg-red-50 text-red-700';
                      }
                    }
                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleAnswer(qIndex, oIndex)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center justify-between ${style}`}
                      >
                        <span>{option}</span>
                        {submitted && oIndex === q.correctAnswer && <CheckCircle size={20} className="text-green-500" />}
                        {submitted && answers[qIndex] === oIndex && oIndex !== q.correctAnswer && <XCircle size={20} className="text-red-500" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700"><strong>Explanation:</strong> {q.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQuiz;