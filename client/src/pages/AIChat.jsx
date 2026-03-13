import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Bot, User, Sparkles } from 'lucide-react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AIChat = () => {
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState({ 
    courseTitle: '', 
    courseContent: '' 
  });
  const [setupDone, setSetupDone] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSetup = (e) => {
    e.preventDefault();
    if (!courseInfo.courseTitle || !courseInfo.courseContent) {
      toast.error('Please fill in all fields!');
      return;
    }
    setSetupDone(true);
    setMessages([{
      role: 'assistant',
      content: `Hi! I'm your AI tutor for **${courseInfo.courseTitle}**. Ask me anything about this course and I'll help you understand it better!`
    }]);
    toast.success('AI Tutor is ready!');
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data } = await API.post('/ai/chat', {
        message: input,
        courseContent: courseInfo.courseContent,
        courseTitle: courseInfo.courseTitle,
        chatHistory: chatHistory.slice(0, -1)
      });

      setMessages([...updatedMessages, {
        role: 'assistant',
        content: data.reply
      }]);
    } catch (error) {
      toast.error('AI tutor failed to respond. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <Bot size={24} />
          AI Tutor Chat
        </h1>
      </nav>

      {/* Setup Form */}
      {!setupDone && (
        <div className="max-w-2xl mx-auto px-6 py-10 w-full">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Setup Your AI Tutor
            </h2>
            <p className="text-gray-500 mb-6">
              Enter your course details and start chatting with your personal AI tutor!
            </p>

            <form onSubmit={handleSetup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  value={courseInfo.courseTitle}
                  onChange={(e) => setCourseInfo({...courseInfo, courseTitle: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Introduction to JavaScript"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Content
                </label>
                <textarea
                  value={courseInfo.courseContent}
                  onChange={(e) => setCourseInfo({...courseInfo, courseContent: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Paste your course content or lecture notes here..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                Start Chatting with AI Tutor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {setupDone && (
        <div className="flex flex-col flex-1 max-w-3xl mx-auto w-full px-6 py-6">
          {/* Messages */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 mb-4 overflow-y-auto max-h-[60vh]">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-indigo-600" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-indigo-600" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ask your AI tutor anything..."
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;