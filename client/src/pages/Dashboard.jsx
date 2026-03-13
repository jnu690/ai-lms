
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={28} />
          <h1 className="text-xl font-bold text-indigo-600">AI LMS</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={20} className="text-gray-500" />
            <span className="text-gray-700 font-medium">{user?.name}</span>
            <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}! 👋
        </h2>
        <p className="text-gray-500 mb-8">
          {user?.role === 'instructor' 
            ? 'Manage your courses and create AI-powered quizzes' 
            : 'Continue your learning journey'}
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm mb-1">
              {user?.role === 'instructor' ? 'Courses Created' : 'Enrolled Courses'}
            </h3>
            <p className="text-3xl font-bold text-indigo-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm mb-1">Quizzes Completed</h3>
            <p className="text-3xl font-bold text-green-500">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm mb-1">AI Features Used</h3>
            <p className="text-3xl font-bold text-purple-500">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.role === 'instructor' && (
            <div className="bg-indigo-600 text-white p-6 rounded-2xl cursor-pointer hover:bg-indigo-700 transition">
              <h4 className="font-bold text-lg mb-1">➕ Create New Course</h4>
              <p className="text-indigo-200 text-sm">Build and publish a new course</p>
            </div>
          )}
          <div onClick={() => navigate('/ai-quiz')}
            className="bg-purple-600 text-white p-6 rounded-2xl cursor-pointer hover:bg-purple-700 transition">
            <h4 className="font-bold text-lg mb-1">🤖 AI Quiz Generator</h4>
            <p className="text-purple-200 text-sm">Generate quizzes using Claude AI</p>
          </div>
          <div className="bg-green-600 text-white p-6 rounded-2xl cursor-pointer hover:bg-green-700 transition">
            <h4 className="font-bold text-lg mb-1">📚 Browse Courses</h4>
            <p className="text-green-200 text-sm">Explore available courses</p>
          </div>
          <div className="bg-orange-500 text-white p-6 rounded-2xl cursor-pointer hover:bg-orange-600 transition">
            <h4 className="font-bold text-lg mb-1">💬 AI Tutor Chat</h4>
            <p className="text-orange-200 text-sm">Get help from your AI tutor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;